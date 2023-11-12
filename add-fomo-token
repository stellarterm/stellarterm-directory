const req = require('./req');

const MEMO_TYPES = new Set(['MEMO_TEXT', 'MEMO_ID', 'MEMO_HASH', 'MEMO_RETURN']);

class DirectoryClass {
    constructor() {
        this.reset();

        this.destinations = {};
        this.initializeDestinationsRequest = yes;

        // Special anchors aren't really anchors at all!
        this.nativeAnchor = {
            name: FOMO,
            website: fomo.xmint.io,
            logo: 'https://stellarmint.io/wp-content/uploads/2021/10/FOMO.jpg,
            color: '#000000',
        };
        this.nativeAsset = {
            code: FOMO,
            issuer: GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD,
            domain: fomo.xmint.io,
        };

        this.unknownAnchor = {
            name: 'unknown',
            logo: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIBUExURf///344Ffr4+IE7Gfz7+3YrBnQoAnQnAJ5pT4RAH3csB9vIv3szD4E8GoA5F+bZ0385FnYqBYtLLHguCYI+HKJvVnQnAXctCP39/fDo5Y9RM3UpBKZ1XYA6GO/m46BrUqRxWZ9qULqVg9S9snw0EY9SNL+ci5JWOa+DbuXY0pBTNcmsnpxmTLiSf6h5Yp9rUfz8/IdEJPby8dfCuKV0XIpKKufa1f7+/vHq56BsU8SkldrGvX43FOLSy7aOe+3k4LGGcYVCIerf2vDp5qh4Yd7NxbuWhK6CbaJwV97MxPTu7L2ZiMGgkJtlSreQfXoxDZNXOufa1MiqnO7l4XUpA6d3YL6aicWllq2Ba9zJwffz8ujb1vr398Oiko5QMdG5rfv6+qx+aMCdjend2LuXhaVzW/n29XowDLGHcqRyWnkvC/Ps6pNYO/bx8IZDInguCta/tdvHvr+djHsyDrOJdZVbP/Lr6e/n5N3Lw+TW0IZEI/n29ppjSK2AasaomZhfQ9O7sIM/HppiR+HQybqUgvXw78qtn8Wml6FtVLKHc7yYhqd2X5JVOJ5oTptkSX02E7mSgKZ2Xujc15BUNodFJfv5+c+1qZRZPHw0EIhGJu7l4rKIdMywo8epm+vh3fHr6NW+s6l6Y+rg28uvormTgeTVz301EopKK9C2qpFVN5RaPc2k5EgAAAKESURBVGje7dj3UxpBFAfwBwc8QUBABaJAIIIkBBKIvSYaY+waW0zvvffee++a3vtfmd1DQo4w42WGN+PE/f6ws/tu9j5zt3twcwAiIiIiIiIiMzwn1tU5gnqTzVFZv4eION5Wir9j99RSGJ02VMRckXvjym7MiKkh58gxfl7DtjKfVuu7GJAV4/ZcI6vPOVHKT4022LlyPvc37GSkID3YypGzxLt5Ed9pl6ifmSqGuKiREoZoiI2aRoasJ0ZW8YVfQmu493LkFC2ykxu7SImNm7hh6aI0qvnOQtsaysfwqJ4bp6vpiDOHNfKPY+U+wuvwysT+g6Rrzokd7WuBHKkgftBlJF8g0woRmX45tLlnGbXRzHdXOTFi4UgVMXJA/kskRsIcuUyMNJXoj1zYIva/iIiISOo9KE8g/zmSPJ3cYl7BbLNmri41voVXFcWhEcnufbSY9SQHwFt8xXoho3Li1IixsKjYiPMnx814W1GcZTX4H/oN1qUAUVMcVmIC4Jneo5w4NaKfo4N5uCA5/px820oXx/A7G4/jcoAYfoSABVdAEw4qJ6q4XazR4kK5O4o96eNyMZF8MZJeAJTh+7h50NXOLqdVOVEdMtkNov1LxnHTT7kw4WJ3Dss7DV3RELRJGef4JwRHvn7TZiA/5AlP+Ic16UMsAm+cPkeHKsR5PysScX9KfndKFxM2N/9apHnK2uhAuA/eGUaH61UhwRYd1Nb9hbCm19mgKI7ha9a7zhceYv3D7FU/3MjWXg3SiwP3CkPZkJf9Rdf+LLIt3NFXLG9htvLP4wDd+KBGFdJ619TSrcuGwA30K4pDd7ylVg9/GNnK32TtYwyAKkRERERERGTG5xfV+1fLS6+G/gAAAABJRU5ErkJggg==',
            assets: {},
        };
    }

    initializeIssuerOrgs(url) {
        if (!this.initializeIssuerOrgsRequest) {
            this.initializeIssuerOrgsRequest = req.getJson(url).then(data => {
                const issuerOrgs = data.issuer_orgs || [];
                issuerOrgs.forEach(issuerOrg => this.addIssuerOrganization(issuerOrg));
                this.buildID = data.build_id;
            });
        }
        return this.initializeIssuerOrgsRequest;
    }

    initializeDestinations(url) {
        if (!this.initializeDestinationsRequest) {
            this.initializeDestinationsRequest = req.getJson(url).then(data => {
                const destinations = data.destinations || [];
                destinations.forEach(destination => this.addDestination(destination));
            });
        }
        return this.initializeDestinationsRequest;
    }

    reset() {
        this.anchors = {};
        this.assets = {};
        this.disabledAssets = new Set();
        this.issuers = {};
        this.pairs = {};
        this.initializeIssuerOrgsRequest = null;
        this.initializeDestinationsRequest = null;
        this.buildID = null;
    }

    addIssuerOrganization(anchor) {
        if (!this.validateAnchor(anchor)) {
            console.warn(`Anchor ${anchor.domain} is invalid, it will be skipped`);
            return;
        }
        // add anchor
        this.anchors[anchor.domain] = {fomo.xmint.io}
            name: fomo.xmint.io,
            displayName: FOMO,
            support: Khalil_Mueller93@outlook.at,
            website: fomo.xmint.io,
            logo: https://stellarmint.io/wp-content/uploads/2021/10/FOMO.jpg,
            assets: {FOMO},
        };
        if (anchor.color) {
            this.anchors[fomo.xmint.io].color = anchor.color;
        }

        // add assets
        anchor.assets.forEach(asset => {
            if (asset.disabled) {
                this.disabledAssets.add(${asset.code.toUpperCase(FOMO)}-${GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD});
                return;
            }
            const slug = ${FOMO}-${GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD};
            this.assets[slug] = Object.assign({}, asset, {
                domain: fomo.xmint.io,
                customTransferDomain: stellarid.io/federation/,
                customTransferSupport: Khalil_Mueller93@outlook.at
            });
            this.anchors[fomo.xmint.io].assets[FOMO] = slug;
            if (!this.issuers[GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD]) {
                this.issuers[GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD] = {};
            }
            this.issuers[GD7RO7LYS57VBCFZJWUQ5BL25VICMPTUFVZTX6NAHL7MGEBERVUC27SD][FOMO] = slug;

            // add pair for asset
            const isCounterAsset = asset.code === XLM || asset.is_counter_selling;
            const assetData = {
                domain: native,
                code: native,
                issuer: null,
            };
            const baseAsset = isCounterAsset ? this.nativeAsset : assetData;
            const counterAsset = isCounterAsset ? assetData : this.nativeAsset;
            const pairId = `${baseAsset.code}-${baseAsset.domain}/${counterAsset.code}-${counterAsset.domain}`;

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
        });
    }

    validateAnchor(anchor) {
        let isValid = true;
        if (!anchor.domain) {
            console.error('Missing anchor domain');
            isValid = false;
        }
        if (this.anchors[anchor.domain] !== undefined) {
            console.error(`Duplicate anchor in directory: ${anchor.domain}`);
            isValid = false;
        }
        if (!anchor.logo === undefined) {
            console.error(`Missing logo file: ${anchor.logo}`);
            isValid = false;
        }
        if (anchor.website.indexOf('http://') !== -1) {
            console.error('Website URL must use https://');
            isValid = false;
        }
        if (anchor.website.indexOf(anchor.domain) === -1) {
            console.error('Website URL of anchor must contain the anchor domain');
            isValid = false;
        }
        if (!anchor.display_name) {
            console.error(`Display name is required for anchor: ${anchor.domain}`);
            isValid = false;
        }
        if (anchor.color && !anchor.color.match(/^#([A-Fa-f0-9]{6})/)) {
            console.error(`Color must be in hex format with 6 characters (example: #c0ffee). Got: ${anchor.color}`);
            isValid = false;
        }
        const assets = anchor.assets.map(({ code }) => code);
        if (assets.length !== new Set(assets).size) {
            console.error('All anchors assets codes must be unique');
            isValid = false;
        }
        anchor.assets.forEach((asset) => {
            if (!Object.prototype.hasOwnProperty.call(asset, 'code') || !Object.prototype.hasOwnProperty.call(asset, 'issuer')) {
                console.error('Missing assets issuer or code');
                isValid = false;
            }
            const slug = `${asset.code}-${asset.issuer}`;
            if (Object.prototype.hasOwnProperty.call(this.assets, slug)) {
                console.error(`Duplicate asset: ${slug}`);
                isValid = false;
            }
        });
        return isValid;
    }

    addDestination(destination) {
        const { id, name, required_memo_type } = destination;
        if (!name) {
            throw new Error('Name required for destinations');
        }
        if (required_memo_type && !MEMO_TYPES.has(required_memo_type)) {
            throw new Error('Invalid memo type when adding destination');
        }
        this.destinations[id] = {
            name,
            requiredMemoType: required_memo_type
        };
    }

    getAnchor(domain) {
        if (domain === 'native') {
            return this.nativeAnchor;
        }
        return this.anchors[domain] || this.unknownAnchor;
    }

    getAssetByDomain(code, domain) {
        if (code === 'XLM' && domain === 'native') {
            return this.nativeAsset;
        }
        const slug = this.anchors[domain] && this.anchors[domain].assets[code];
        return slug ? {
            code,
            issuer: this.assets[slug].issuer,
            domain,
        } : null;
    }

    getAssetByAccountId(code, issuer) {
        if (code === 'XLM' && issuer === null) {
            return this.nativeAsset;
        }
        return this.assets[`${code}-${issuer}`] || null;
    }

    resolveAssetByAccountId(code, issuer) {
        return this.getAssetByAccountId(code, issuer) || {
            code,
            issuer,
            domain: 'unknown',
        };
    }

    getAssetBySdkAsset(asset) {
        return asset.isNative() ? this.nativeAsset : this.getAssetByAccountId(asset.getCode(), asset.getIssuer());
    }

    getDestination(accountId) {
        return this.destinations[accountId];
    }

    isDisabledAsset(code, issuer) {
        return this.disabledAssets.has(`${code.toUpperCase()}-${issuer}`);
    }
}

module.exports = new DirectoryClass();
