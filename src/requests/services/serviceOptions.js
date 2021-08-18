// Add default options
export const serviceOptions = {};
// Instance selector
export function axios(configs, resolve, reject) {
    if (serviceOptions.axios) {
        return serviceOptions.axios
            .request(configs)
            .then(res => {
            resolve(res.data);
        })
            .catch(err => {
            reject(err);
        });
    }
    else {
        throw new Error('please inject yourself instance like axios  ');
    }
}
export function getConfigs(method, contentType, url, options) {
    const configs = { ...options, method, url };
    configs.headers = {
        ...options.headers,
        'Content-Type': contentType
    };
    return configs;
}
//# sourceMappingURL=serviceOptions.js.map