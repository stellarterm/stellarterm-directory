const req = require('./req');

const MEMO_TYPES = new Set(['MEMO_TEXT', 'MEMO_ID', 'MEMO_HASH', 'MEMO_RETURN']);

class DirectoryClass {
    constructor() {
        this.reset();

        this.destinations = {};
        this.initializeDestinationsRequest = null;

        // Special anchors aren't really anchors at all!
        this.nativeAnchor = {
            name: 'Bonfirestellar',
            website: 'https://bonfirestellar.org',
            logo: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAASUklEQVRoge2aW1Sb15XHpU+fPt2vCCFACCGEEBIIIYQQAgkhxF1gEBfjGxiCMXYwsR0c49h1HdfGTpw4jhOnbu3aSZpknMZN07STtGmm7UyTJjOdlcma6WUe0jXTteZh+jYP8/6bB5yLg504bdbKdNY87JfzrXPO9zv7v/c+35ZkMpmM/yP2pb/A/24QxQ37iwf5wOR/uSByREFAqxIxaJTo1Up0ahGjVolWJaIQhM9cQ/giQcQbp3kn8hAEAatBorO+iKX+ap7b18o7T+R46+EufnQkwwt3p3hxIc6jExEObQiz1F9Da00hRq2EXC6/5d5fCIhcJkNzY0Hlp0xWigIht5njk3W8uDPKtR2t/PxojndPjfL7azP85qlZ3jk5zMu7MnxnRwff3Jplvq2N1d4E5/JtnN2U4O6eanwlBsQ78NQ6YFFAVAgfgXzeExDkcnwlBk5tiXB1cZyLYzFeWWjiteUs7397D289NMM/XdzNC8ubefrgHOdmp3lkZoITE8PsGxziW0tbOLklz2RjGw8M9/DCQisHN4QoNKnvaH+NpCBaZWN+PEs25vvTYkSrEpnJePnZoU5+vNjC93bFeXUpzetHJjg1s4Vr98/xi8eWubh/juvHdnDxwCwP7Jzi/P45ru+f5JmlzSwO5vna5ChHBrKcntrEfLiOs+kgDw+HCbqst91bEhV0hks4sKWfqd2HGT7zKndNdn5+EJtRzepMmh8t9/LibIo3v9rP3z2Q46WDY1w4OMezBzZyYnsHU9lqYlVWXIU6isxqHGY1LpuWRq+VTe2V7B9P8cDOMR7ePsr5yXYWonVc3pziodE6qkpM6/ZVCHK8xQaWc0EW2ttoya8wcu4N3vi3/+LIztznAym2qHn+YA+/fGSWd8+O85MjY/z0xDZ+c2mepw+MMtrmxW5SIwg3B++tZKsQBBxmNVvTHp7Z081XRptI1xUhKW+OE1EQ8JUYuLu3hpXuBgar/OTrG0j17yD35E957z//m/vn+u8cpNCk5rHZVp7fM8bvnlrh1xd38odXjvKN5Wnme2ow66Rbx5JMhlmQE9SK6wP1xnO9WkSlVNz8TCHgKzWwPFjH/d31pJ1uhsvcjHiraCgLEIxsID97iNXD81SVmu4MRKsSOTPVyG/Pj/P6kU1c3DvDN/dM87UdORq9BQifkm0Mchn3hq1kzMr1epetT+2CIKemzMRSf4h7+lvJeypJOL3EyrzESisYbc2QizQwl4sRr7YhiTft/enZaSZbyT8+lOOl/eNc3ruJh3ZOc2ymhzKb7jM92V1u5BcrzSQ14k0v/cmCJ5fJKTCoWBwIcnpLN8PVASa9lWQrfHicPuqcfnLhWhb7w7TXOlBL4o15sjsDcRZoeWBTnLefvIvDEyNMDm9lx+ZhymxaiiUFwsdiQC2Xo5LLPtyg3iTxyvYq/uFwI8sBE3bles8JghxBvnYTKNcoWexJcCqfpdkTIugK4CqtIVDsYr4nTEeo5EOADw5DEgSUonAzyCfdrBQFKh16ajQi7hIXvsRmdk5todZpQiuTEbdIhFUKdlfq8BuUOESBIbsKuySwErVyocvBwXAB17f5ONFRxql+LzZBQCWTkbRKuFQKtIJAv11NnU5JziZRoJLwlHjY0txMPNiIRq3HrxE/KSEkUUGo3MzyRAu9zd5P90jYY2Gqp54Bq0TaIGIvriBdX4FKLseqEJh26xjzGNkbtHCswcrpFhs1OiWX8xUs+E3sDpp4ZqSMo2ELT2SdvLTVywtbqrg06qVWLzHj0XE8ZGQ5YOR4m4PWAomRMi1WtZahmJ9qm56MQUnaIn0oIZVSQWvAzq4NUZ5b7GZnbwebM4Hbg8jlMsbaPGQiIRyiwFafiRNZJ0shC4v1BdgFOV8JWzjZYudcpoRpn4mMSeJYs53vbq3i6Q1OTscK2O838J3JSsbdRq5O+pkoM7DcUMi5bCnzXh3TTi0PJQp4akM5JyJWmg1KVhqtLNRZ+PqQi7hFhUkhIJfJqHWZObK5laGuHjZ29jDQlmGguZWF3prbg6iUCkxKkaxNolKl4GKvk2vj5Sz6jDyccnAgUcKxkImJMh2rrUWc6yhhW4mG+5qd/Pp4lEfbijjTbOVoQM9kuY4+s8SDCQePdpfyw/kAf7UtQK9dzYOJIg6GTJyIFXC6ycpTQy4ONxayEi7g2ngFD7YX4xAFOmwSruISvjY1wkg2R0tyiNlcH6e39HLfWP16EOlG8DpUIsV6NQ6lgEMu52zKwYxbz0ythSG3gfPdTpaqDZRJCup1Is9u9dOoE9nqNnFlrJJLORf9ZVoqRIGVeCHHs272Bs0sVRlY8Jq4utFHk15ktctFX5mevFPHDq+R0x0Oci49c0ET+2ot7AtaKVLIsQhyLDozjZ4AFc5q/IE4jy0McXFXmqDLcjNIuUJgwWvkdMrBgQYbJxosnO0uY7RIzWrMRotOyd56C20FKhxKgZhBSbmkIF+kYtChJlGo5qsNFnI2Fd02iZRNzZlkIfO1Jpab7DQZlNQYJRaqjUyXaTkaszHv0TFmVxPUirSZJYxyOQMlapZqzeSKNRyL2BguUnOxt4RDtRYOx2ystjoYd+rxmdRoVDcV2htZSiYjXqjl5d0N/O1SgFemvZxP2jnZYObyQBn1SgGPSY1DK6JVCljUIkZpLfOoBTkFGhG7RsQoCWiUAnqlgFKQo1YKKAQBtSigkUQMkgKLpMChk/CZJKwqEYdWiUm1tl6hWiTn1JIr0fFo0sFDMSsXOhz8eEcVv1qp54mcC49WvNWX580DtXqJ57f4WWkq4rmxCk5GrAxbVTRpRSqsSt7Y7+OtlWrePOjjrfv9nBh24jJLvLbk5a1Da+NvHvRxKFOAVavghVk3oWI1T0w4+eXhmrXnKz5+eI8Pl0XixKDjo/GDPvalbWgEgYxJYme5jtWIhRc2elgKWvlmvhK/WY1GpVgX1+tABJmMvc0ONrsNXB6q4EiTnacnqmgzq/AUSPz2dJiRai3JcjW742beORaiyibxL6fCTAb1pMrVJMvVlBpFTBoFv3ogREOJlu8u+TnRayfpUpP1aHnvRD3pSj2XZj2cHy0h5VqbFyiUkOQyNrr0XBtzseQzcHmkknsa7WSdBkayEbSq9Xe3dSBKhUDWZeQrrcVcGHATM6qIaER6TRKeAonfn2vi/Hgpq4MOnp4q49qCF5dZyb8+0siFyTJWhxwcH3DgKZDWgUw3F9Dq1vLgkIP3z0ZIeXRcmvHw+rKf1aFiVoccDNeZKJcU9Jkk/EoFmypNrMSKuDTswWPUMb9xAL36U0A+0JxBo8RlUnNlspqnN7h4cS5Eu0nFot9wAyTK+bGSNZDtbq7t8t0AiXBhYm38eF8RHuvNINeX/Ew1F1BfquEPX49zst+OQaXg8mwlr+/3sTroYHXQwXDQQIlSYE+1gVyRhp8uBnlqyMWhtmJ0hW6mJvMY1Osvoes8YtQq2TUUp0an4Wyukp/vDXEl76HD8oG0GsjX6Em5NOyOmT6U1rvHQ1TZ1FT7qojFYhhNpnUemWouQCEIXNjqZrHdjkwm4/JsJefHnSTLNSTLNTSXaTCKAnmnju/P+nl9oZqDTTacOhNlDb3MjWbvTFo2o4oHdwxQ5qojYZaY9hpYjKwFYIVV4o17Pwr2Xx7ycyLnwGVW8uKcm8oCFUP9PWwa7mdh5wI2g5rv3OUm5FDz+MYyxkIm7HYH9aUarmwtw6YTOTFUzNtHanjzvrVg/8lSJWO1ekRBTpGoIGFV49OKlAaylEQ2sHko9fGGw61BFILAtkwlLx/byuO7hyg1GWh16rFaLIQCfgw6LQaNhMWgwWrQYNKrsZoMFNmsmPVqTHod6UQTuWyKTCJGoc2GRlJgMhqwGLSYDTr8NUFEUcRq0GLS6ygw6bAatFiNWqwGLXq1Eotejb3ASmdnFqtBR6HVTn20m9bmHma6627ZQvqojigE+hpLOT07zJVdQ7x1YZFUvBuD3kBXtpPGUJDhvm7aW5rIJGL0ZVrpbG2mtz3BUFeK9uYI+f4sAZ+Xge4Muc4knZkOSkpKSKc76M8kSTaF2TYxRjxSz1h/F+3NESaHehnty5KKNTCR66G5oY7+jlZaohGaImGi0RhFrjqmu3s5kM+yMeW9FcQaiN9pYmmogfmuNlaG2nl0c5aXDo6ycXgTxUVF5Pr7CFT7yGbS5Loz5PsytDZFyPVk6U7FaY9HySYT5LoyNEXC5LrSDGQSDPZkqa+vJx6LkmisJxULM9ybIdnUwHBPhngkRL6vm55UC4loPd3tibW1m5vwVXroSqeIRptoCYZZ6evk8u5BfCWGW4MIcjkzXbV01jUR8sVIRdrZ1N3Lxb1b+P7+HoqsBvr6+mlpaqTaW0lbSwud7Ukq3BWMDg/Tk2qhp72FzmQLodpaMpksI/1Z2prCNEdCBGt8RMMh2prCpOONbOjuJNEYJh4J05GI0Z1soTedoLs9QShQTXuiGb+vimRLjI5UEpvNRjKWYrwrx7XlLGrplsVwDWS2K8RwKMpsKks+mWVvvo8HpuLUuc0IgpxSZxnDQ0NEwyHKS4uxmEz4/QHCoVqyqQSNdTW0xqL4fD56+3IkYxG8FS58HjdVFeVUul0EqjwEq72kmmMkm5sI+qvpTCVpDteRikeJNoSJx1swGo243W6CgSAupxNXsYv9G3LM9vayvdN3O1mtgSwPN9JRG2epL8PuwQbq3OZ1mUGr0WC3GDGZ7eh0Znp7cySaGolHQiSaGmiOxdHp9EQaYyTjMfxeD1U3YHweNyVFhQR9XhpDQVJtSXQ6Ha2JNqKRMPFIPdFQgHR7BplsrQ2UT3hZ2pDiG/eMc7Q/wfmZNCVWze1B5HIZW9N+FnNRol7rOgC1JNLss/Hg9gRHZybo6ttKviWJ0Wgmk+4kEY8TawiTTKYQBDlFDgfpVAqvx02Fy4nDXojdbsdT4cZTXkbA5yXSEEEURerrI2Q7MkTqAtTXBii02ZDLZGQbnJya38zPVhf44xuHeeNojn05/7qe2bpgV0uKj3/ErwEoFaTrHBybjLE8kuVYvpvpoU1cnstzKN9PQ6CJiuICDAYjxcXFqFSqm+abTCZ0Ou1HhdZgoMzpxGwyfvT9I0n4fH6K7IUftpXq3RZePLKFR+a28e/f3ctPjozy1I4URebP7AvfPKAQBIIuE8cnwlyZTrM3FeH+ngRHc3FW+lPcnRvg8KYc84Mx6tzmO/q9406trtzMD45P8s75Hbz/zDzvrA7x8kKC7nAJctmneuMjEEkUaPRaWRqoZd9Imvs6GtjVWMuGUJiFeIieQAMvLmZYGmmirtyC4tPd/LlMFAQy4RL+enWWv//GIn/80V5+92SeK6NhlnqqblfJ14M0VFg5MljLxuZaUuWVpMrc5L1euqrrGK4NM9sR49CGMJFKyycWlaNXi+jVSmTyzw8gl8uwm1Qc3RLnrQvL/Obqft48M8V75/q4Oh7h8HAIrXTLe9Wtgl3O7rSPXJWfmkIXG8pK2eatoM/jZXtrmH25EI1eK8pPnIpeLTLe5ub45nZWNnawMVVJkVl9x1KzGVXMdVXzrXsnef+ZQ/z2ym7ev7qNv9nfyaUBHycm6253Xb+1CXI5m9N+3AVOEkVOtla5uT9Vy70DdUQqreuSgEwmw1Nk4OSmZl7Z283FzS08vXuEjdkBlrfkWMy3MJWpIuEvxFusp9SqxWnT4isxkKotYjBWxkJPkOf3ZfnnJ7fz9plp/uP6PO9fnuDtY2082R9gX58P3a1vuJ8OMt8VJFvsZD7qZ09vLclA4boO+cctUmnj0myKb+/I8r35KGfHkmxqa2eksYntHRmWN/Txg2M7eHw+z5NzOU5t6+bcdD9PTPXw8GQPF/IJXl1s4b2z3bx9Osere9Jc3x7muel6co0ldxoT66W1MVHJni4/Les73LfVtqtQx33DtTw11cKZ4RbyDQ2cH4ny7FIfJyfSPLFzkke39fHMXI6Fjna2RVuYTyU50BbhXNbPa3tivLajhlfuquP6zhjz2WpKrJo/5+fstaInibf3wO1MIQh4HHp2dlXz6NYW3n2on8vbslzZ1sKzc+1c2hhjKVbPZG2QxYifU10BHu/2cSpZyeXhOi5NBtnR6cVt131WsbszkD/X5HIZFr1ENuxg72CQM5uiXN+T4NnpKGdHG7k628TVbREe2xTl1GiAXd0+2gI2jFrlF/mHgi9soQ9NVAjo1CIWg4TNKGEzqrDoJbQq8U/T/5cF8iXZl/4C/w/yfxLkfwAocowCycdZCAAAAABJRU5ErkJggg==',
            color: '#F8F19F',
        };
        this.nativeAsset = {
            code: 'LOGS',
            issuer: 'GDI74JMESJILV7YHADQ4GIM4DRBICUANQVZK653C4VOD6HAUEV6RACP3',
            domain: 'bonfirestellar.org',
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
            if (asset.disabled) {
                this.disabledAssets.add(`${asset.code.toUpperCase()}-${asset.issuer}`);
                return;
            }
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

    isDisabledAsset(code, issuer) {
        return this.disabledAssets.has(`${code.toUpperCase()}-${issuer}`);
    }
}

module.exports = new DirectoryClass();
