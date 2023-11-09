const https = require('https');

function get(url, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let body = '';
            res.on('data', (d) => {
                body += d;
            });
            res.on('end', () => {
                resolve(body);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

function getJson(url, options) {
    return get(url, options)
        .then(body => {
            return JSON.parse(body);
        });
}

module.exports = {
    get,
    getJson,
};
