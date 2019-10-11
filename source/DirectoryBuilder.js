const logos = require('./../logos/build/logos');
const buildInfo = require('./../static/buildInfo');
// We depend on logos being compiled to a js script so that it can be trivially included
// in the StellarTerm client without webpack

// Constraints: Data should be easily serializable into JSON (no references to each other)
// directory.js should not depend on creating objects with StellarSdk (though its methods should support reading them)

// Note: the DirectoryBuilder concept of slug is slightly different from that of Stellarify
// slugs here can only have the format `code-accountId`

function DirectoryBuilder() {
  // There is a reason why prototypical "classes" are used here instead of ES6
  // classes. The reason is that some build processes such as create-react-app
  // expect modules to work in ES5 without transpilation. Instead of adding
  // another complexity in the directory build process, we just use good ol
  // JavaScript prototypical "classes" here.

    this.anchors = {};
    this.destinations = {};
    this.assets = {};
    this.issuers = {};
    this.wildcardIssuers = {};
    this.wildcardDomains = {};
    this.pairs = {};

  // Special anchors aren't really anchors at all!
    this.nativeAnchor = {
        name: 'Stellar Network',
        website: 'https://www.stellar.org/lumens/',
        logo: logos.stellar,
        color: '#000000',
    };
    this.nativeAsset = {
        code: 'XLM',
        issuer: null,
        domain: 'native',
    };

    this.unknownAnchor = {
        name: 'unknown',
        logo: logos.unknown,
        assets: {},
    };
}

DirectoryBuilder.prototype.toJson = function () {
    return JSON.stringify(this, null, 2);
};

DirectoryBuilder.prototype.getBuildId = function () {
    return buildInfo.buildId;
};

DirectoryBuilder.prototype.addAnchor = function (details) {
    if (this.anchors[details.domain] !== undefined) {
        throw new Error(`Duplicate anchor in directory: ${details.domain}`);
    }
    if (logos[details.logo] === undefined) {
        throw new Error(`Missing logo file: ${details.logo}`);
    }
    if (details.website.indexOf('http://') !== -1) {
        throw new Error('Website URL must use https://');
    }
    if (details.website.indexOf(details.domain) === -1) {
        throw new Error('Website URL of anchor must contain the anchor domain');
    }
    if (!details.displayName) {
        throw new Error(`Display name is required for anchor: ${details.domain}`);
    }

    this.anchors[details.domain] = {
        name: details.domain,
        displayName: details.displayName,
        support: details.support,
        website: details.website,
        logo: logos[details.logo],
        assets: {},
    };

    if (details.color) {
        if (!details.color.match(/^#([A-Fa-f0-9]{6})/)) {
            throw new Error(`Color must be in hex format with 6 characters (example: #c0ffee). Got: ${details.color}`);
        }
        this.anchors[details.domain].color = details.color;
    }
};

DirectoryBuilder.prototype.addAsset = function (anchorDomain, details) {
    const slug = `${details.code}-${details.issuer}`;

    if (!Object.prototype.hasOwnProperty.call(this.anchors, anchorDomain)) {
        throw new Error(`Attempting to add asset to nonexistent anchor: ${anchorDomain} slug: ${slug}`);
    }

    if (Object.prototype.hasOwnProperty.call(this.assets, slug)) {
        throw new Error(`Duplicate asset: ${slug}`);
    }
    if (Object.prototype.hasOwnProperty.call(this.anchors[anchorDomain].assets, details.code)) {
        throw new Error(`Adding asset to anchor with existing asset of same code: ${slug}`);
    }
    if (!Object.prototype.hasOwnProperty.call(this.issuers, details.issuer)) {
    // Issuer doesn't exist
        this.issuers[details.issuer] = {};
    } else if (Object.prototype.hasOwnProperty.call(this.issuers[details.issuer], details.code)) {
        throw new Error(`Duplicate asset code for an issuer: ${slug}`);
    }

  // TODO: better validation for code and issuer
    this.assets[slug] = {
        code: details.code,
        issuer: details.issuer,
        domain: anchorDomain,
    };
    if (details.deposit) {
        this.assets[slug].deposit = details.deposit;
    }
    if (details.withdraw) {
        this.assets[slug].withdraw = details.withdraw;
    }
    if (details.disabled) {
        this.assets[slug].disabled = true;
    }
    if (details.unlisted) {
        if (details.unlisted !== true) {
            throw new Error(`Asset property unlisted must be unset or true: ${slug}`);
        }
        this.assets[slug].unlisted = true;
    }

    this.anchors[anchorDomain].assets[details.code] = slug;
    this.issuers[details.issuer][details.code] = slug;
};

// Wildcards are a 1-to-1 mapping to a domain
DirectoryBuilder.prototype.addWildcard = function (anchorDomain, details) {
    if (!Object.prototype.hasOwnProperty.call(this.anchors, anchorDomain)) {
        throw new Error(`Attempting to add wildcard asset to nonexistent anchor: ${anchorDomain}`);
    }
    if (details.issuer === undefined) {
        throw new Error('Missing issuer when trying to add wildcard');
    }

    if (Object.prototype.hasOwnProperty.call(this.wildcardIssuers, details.issuer)) {
        throw new Error(`Duplicate issuer in wildcards: ${details.issuer}`);
    }
    if (Object.prototype.hasOwnProperty.call(this.wildcardDomains, anchorDomain)) {
        throw new Error(`Duplicate domain in wildcards: ${details.issuer}`);
    }

    this.wildcardIssuers[details.issuer] = anchorDomain;
    this.wildcardDomains[anchorDomain] = details.issuer;
};


DirectoryBuilder.prototype.addDestination = function (accountId, opts) {
    if (!opts.name) {
        throw new Error('Name required for destinations');
    }
    this.destinations[accountId] = {
        name: opts.name,
    };
    if (opts.requiredMemoType) {
        if (!(opts.requiredMemoType === 'MEMO_TEXT'
       || opts.requiredMemoType === 'MEMO_ID'
       || opts.requiredMemoType === 'MEMO_HASH'
       || opts.requiredMemoType === 'MEMO_RETURN')) {
            throw new Error('Invalid memo type when adding destination');
        }
        this.destinations[accountId].requiredMemoType = opts.requiredMemoType;
    }

    this.destinations[accountId].mergeOpAccepted = false;
    if (opts.mergeOpAccepted !== undefined) {
        if (opts.mergeOpAccepted === true) {
            this.destinations[accountId].mergeOpAccepted = true;
        } else if (opts.mergeOpAccepted !== false) {
            throw new Error('Destination opts.mergeOpAccepted must either be true or false');
        }
    }

    this.destinations[accountId].pathPaymentAccepted = false;
    if (opts.pathPaymentAccepted !== undefined) {
        if (opts.pathPaymentAccepted === true) {
            this.destinations[accountId].pathPaymentAccepted = true;
        } else if (opts.pathPaymentAccepted !== false) {
            throw new Error('Destination opts.pathPaymentAccepted must either be true or false');
        }
    }

    if (Array.isArray(opts.acceptedAssetsWhitelist)) {
        this.destinations[accountId].acceptedAssetsWhitelist = [];
        opts.acceptedAssetsWhitelist.forEach((assetSlug) => {
            if (typeof assetSlug !== 'string') {
                throw new Error(`Destination opts.acceptedAssetsWhitelist must be string. Got: ${assetSlug}`);
            } else if (assetSlug.indexOf('-') < 1) {
                throw new Error(`Destination opts.acceptedAssetsWhitelist must be in slug format like XLM-native or BTC-GA7B. Got: ${assetSlug}`);
            }

            this.destinations[accountId].acceptedAssetsWhitelist.push(assetSlug);
        });
    }
};

// Must specify by domain
// You can only add pairs with known issuers. Otherwise, the purpose of the directory is defeated
DirectoryBuilder.prototype.addPair = function (opts) {
    if (!opts.baseBuying || !opts.counterSelling) {
        throw new Error('Both baseBuying and counterSelling are required when adding pair. (You probably have a duplicate?)');
    }
    const baseAsset = this.getAssetByDomain(opts.baseBuying[0], opts.baseBuying[1]);
    const counterAsset = this.getAssetByDomain(opts.counterSelling[0], opts.counterSelling[1]);
    if (baseAsset === null) {
        throw new Error(`Unknown baseBuying asset when adding pair: ${opts.baseBuying[0]}-${opts.baseBuying[1]}`);
    }
    if (counterAsset === null) {
        throw new Error(`Unknown counterSelling asset when adding pair: ${opts.counterSelling[0]}-${opts.counterSelling[1]}`);
    }
    const pairId = `${baseAsset.code}-${baseAsset.domain}/${counterAsset.code}-${counterAsset.domain}`;
    if (Object.prototype.hasOwnProperty.call(this.pairs, pairId)) {
        throw new Error(`Adding duplicate trading pair: ${pairId}`);
    }
    if (Object.prototype.hasOwnProperty.call(this.pairs, `${counterAsset.code}-${counterAsset.domain}/${baseAsset.code}-${baseAsset.domain}`)) {
        throw new Error(`Adding duplicate trading pair (in reverse): ${pairId}`);
    }
    this.pairs[pairId] = {
        baseBuying: {
            code: baseAsset.code,
            issuer: baseAsset.issuer,
        },
        counterSelling: {
            code: counterAsset.code,
            issuer: counterAsset.issuer,
        },
    };
};

// Always returns something regardless of what is put in
DirectoryBuilder.prototype.getAnchor = function (domain) {
    if (!domain) {
        return this.unknownAnchor;
    }
    if (domain === 'native') {
        return this.nativeAnchor;
    }
    if (Object.prototype.hasOwnProperty.call(this.anchors, domain)) {
        return this.anchors[domain];
    }

    return this.unknownAnchor;
};

// DEPRECATED so that we won't have a external dependency of StellarSdk
// getAsset() is general and takes in any of the combination:
// - code:string, issuerAccountId:string
// - code:string, anchorDomain:string
// - sdkAsset:StellarSdk.Asset
// All functions that are getAssset*() will return null if the asset is not found
// getAsset(codeOrSdkAsset, domainOrAccountId) {
//   if (codeOrSdkAsset instanceof StellarSdk.Asset) {
//     return this.getAssetBySdkAsset(codeOrSdkAsset);
//   }

//   if (StellarSdk.StrKey.isValidEd25519PublicKey(domainOrAccountId) ||
//      domainOrAccountId === null) {
//     return this.getAssetByAccountId(codeOrSdkAsset, domainOrAccountId);
//   }
//   return this.getAssetByDomain(codeOrSdkAsset, domainOrAccountId);
// }

// Returns null if asset is not found
DirectoryBuilder.prototype.getAssetByDomain = function (code, domain) {
    if (code === 'XLM' && domain === 'native') {
        return this.nativeAsset;
    }
    if (!Object.prototype.hasOwnProperty.call(this.anchors, domain)) {
        return null;
    }
    if (Object.prototype.hasOwnProperty.call(this.anchors[domain].assets, code)) {
        const slug = this.anchors[domain].assets[code];
        return {
            code,
            issuer: this.assets[slug].issuer,
            domain,
        };
    }

    if (Object.prototype.hasOwnProperty.call(this.wildcardDomains, domain)) {
        return {
            code,
            issuer: this.wildcardDomains[domain],
            domain,
        };
    }

    return null;
};

// Returns unknown if asset is not found
DirectoryBuilder.prototype.getAssetByAccountId = function (code, issuer) {
    if (code === 'XLM' && issuer === null) {
        return this.nativeAsset;
    }

    const slug = `${code}-${issuer}`;
    if (!Object.prototype.hasOwnProperty.call(this.assets, slug)) {
        if (Object.prototype.hasOwnProperty.call(this.wildcardIssuers, issuer)) {
            return {
                code,
                issuer,
                domain: this.wildcardIssuers[issuer],
            };
        }

        return null;
    }
    return this.assets[slug];
};

// Finds an asset by the accountId but if it fails, we will still return
// an asset but with an empty domain
DirectoryBuilder.prototype.resolveAssetByAccountId = function (code, issuer) {
    const asset = this.getAssetByAccountId(code, issuer);
    if (asset) {
        return asset;
    }

    return {
        code,
        issuer,
        domain: 'unknown',
    };
};

DirectoryBuilder.prototype.getAssetBySdkAsset = function (asset) {
    if (asset.isNative()) {
        return this.nativeAsset;
    }
    return this.getAssetByAccountId(asset.getCode(), asset.getIssuer());
};

DirectoryBuilder.prototype.getDestination = function (accountId) {
    return this.destinations[accountId];
};

// getAssetsByIssuer() {
//   // To be implemented when there is actually a use case
// }

// getAnchorByAsset() {
//   // To be implemented when there is actually a use case
// }

module.exports = DirectoryBuilder;
