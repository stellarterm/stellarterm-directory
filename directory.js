const req = require('./req');

const MEMO_TYPES = new Set(['MEMO_TEXT', 'MEMO_ID', 'MEMO_HASH', 'MEMO_RETURN']);

class DirectoryClass {
    constructor() {
        this.anchors = {};
        this.destinations = {};
        this.assets = {};
        this.issuers = {};
        this.pairs = {};
        this.initializeAnchorsRequest = null;
        this.initializeDestinationsRequest = null;
        this.buildID = null;

        // Special anchors aren't really anchors at all!
        this.nativeAnchor = {
            name: 'Stellar Network',
            website: 'https://www.stellar.org/lumens/',
            logo: 'data:image/png;base64, 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',
            color: '#000000',
        };
        this.nativeAsset = {
            code: 'XLM',
            issuer: null,
            domain: 'native',
        };

        this.unknownAnchor = {
            name: 'unknown',
            logo: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIBUExURf///344Ffr4+IE7Gfz7+3YrBnQoAnQnAJ5pT4RAH3csB9vIv3szD4E8GoA5F+bZ0385FnYqBYtLLHguCYI+HKJvVnQnAXctCP39/fDo5Y9RM3UpBKZ1XYA6GO/m46BrUqRxWZ9qULqVg9S9snw0EY9SNL+ci5JWOa+DbuXY0pBTNcmsnpxmTLiSf6h5Yp9rUfz8/IdEJPby8dfCuKV0XIpKKufa1f7+/vHq56BsU8SkldrGvX43FOLSy7aOe+3k4LGGcYVCIerf2vDp5qh4Yd7NxbuWhK6CbaJwV97MxPTu7L2ZiMGgkJtlSreQfXoxDZNXOufa1MiqnO7l4XUpA6d3YL6aicWllq2Ba9zJwffz8ujb1vr398Oiko5QMdG5rfv6+qx+aMCdjend2LuXhaVzW/n29XowDLGHcqRyWnkvC/Ps6pNYO/bx8IZDInguCta/tdvHvr+djHsyDrOJdZVbP/Lr6e/n5N3Lw+TW0IZEI/n29ppjSK2AasaomZhfQ9O7sIM/HppiR+HQybqUgvXw78qtn8Wml6FtVLKHc7yYhqd2X5JVOJ5oTptkSX02E7mSgKZ2Xujc15BUNodFJfv5+c+1qZRZPHw0EIhGJu7l4rKIdMywo8epm+vh3fHr6NW+s6l6Y+rg28uvormTgeTVz301EopKK9C2qpFVN5RaPc2k5EgAAAKESURBVGje7dj3UxpBFAfwBwc8QUBABaJAIIIkBBKIvSYaY+waW0zvvffee++a3vtfmd1DQo4w42WGN+PE/f6ws/tu9j5zt3twcwAiIiIiIiIiMzwn1tU5gnqTzVFZv4eION5Wir9j99RSGJ02VMRckXvjym7MiKkh58gxfl7DtjKfVuu7GJAV4/ZcI6vPOVHKT4022LlyPvc37GSkID3YypGzxLt5Ed9pl6ifmSqGuKiREoZoiI2aRoasJ0ZW8YVfQmu493LkFC2ykxu7SImNm7hh6aI0qvnOQtsaysfwqJ4bp6vpiDOHNfKPY+U+wuvwysT+g6Rrzokd7WuBHKkgftBlJF8g0woRmX45tLlnGbXRzHdXOTFi4UgVMXJA/kskRsIcuUyMNJXoj1zYIva/iIiISOo9KE8g/zmSPJ3cYl7BbLNmri41voVXFcWhEcnufbSY9SQHwFt8xXoho3Li1IixsKjYiPMnx814W1GcZTX4H/oN1qUAUVMcVmIC4Jneo5w4NaKfo4N5uCA5/px820oXx/A7G4/jcoAYfoSABVdAEw4qJ6q4XazR4kK5O4o96eNyMZF8MZJeAJTh+7h50NXOLqdVOVEdMtkNov1LxnHTT7kw4WJ3Dss7DV3RELRJGef4JwRHvn7TZiA/5AlP+Ic16UMsAm+cPkeHKsR5PysScX9KfndKFxM2N/9apHnK2uhAuA/eGUaH61UhwRYd1Nb9hbCm19mgKI7ha9a7zhceYv3D7FU/3MjWXg3SiwP3CkPZkJf9Rdf+LLIt3NFXLG9htvLP4wDd+KBGFdJ619TSrcuGwA30K4pDd7ylVg9/GNnK32TtYwyAKkRERERERGTG5xfV+1fLS6+G/gAAAABJRU5ErkJggg==',
            assets: {},
        };
    }

    initializeAnchors(url) {
        if (!this.initializeAnchorsRequest) {
            this.initializeAnchorsRequest = req.getJson(url).then(data => {
                const anchors = data.anchors || [];
                anchors.forEach(anchor => this.addAnchor(anchor));
                this.buildID = data.build_id;
            });
        }
        return this.initializeAnchorsRequest;
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

    addAnchor(anchor) {
        if (!this.validateAnchor(anchor)) {
            console.warn(`Anchor ${anchor.domain} is invalid, it will be skipped`);
            return;
        }
        // add anchor
        this.anchors[anchor.domain] = {
            name: anchor.domain,
            displayName: anchor.display_name,
            support: anchor.support,
            website: anchor.website,
            logo: anchor.logo,
            assets: {},
        };
        if (anchor.color) {
            this.anchors[anchor.domain].color = anchor.color;
        }

        // add assets
        anchor.assets.forEach(asset => {
            const slug = `${asset.code}-${asset.issuer}`;
            this.assets[slug] = Object.assign({}, asset, {
                domain: anchor.domain,
                customTransferDomain: asset.custom_transfer_domain,
                customTransferSupport: asset.custom_transfer_support
            });
            this.anchors[anchor.domain].assets[asset.code] = slug;
            if (!this.issuers[asset.issuer]) {
                this.issuers[asset.issuer] = {};
            }
            this.issuers[asset.issuer][asset.code] = slug;

            // add pair for asset
            const isCounterAsset = asset.code === 'BTC' || asset.is_counter_selling;
            const assetData = {
                domain: anchor.domain,
                code: asset.code,
                issuer: asset.issuer,
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
}

module.exports = new DirectoryClass();
