/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */
import { getConfigs, axios } from './serviceOptions.js';
export const basePath = '/api-auth';
export class ListResultDto {
    items;
}
export class PagedResultDto {
    totalCount;
    items;
}
// customer definition
// empty
export class AuthApiImplService {
    static infoPath = '/info';
    static infoMethod = 'get';
    /**
     * 获取登录用户信息
     * @path /info
     */
    static info(options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/info';
            const configs = getConfigs('get', 'application/json', url, options);
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
    static loginPath = '/login';
    static loginMethod = 'post';
    /**
     * 用户登录
     * @path /login
     */
    static login(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/login';
            const configs = getConfigs('post', 'application/json', url, options);
            let data = params['loginRequest'];
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
    static logoutPath = '/logout';
    static logoutMethod = 'post';
    /**
     * 退出登录
     * @path /logout
     */
    static logout(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/logout';
            const configs = getConfigs('post', 'application/json', url, options);
            let data = params['logoutRequest'];
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
//# sourceMappingURL=index.js.map
