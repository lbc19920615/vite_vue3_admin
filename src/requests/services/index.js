/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */
import { getConfigs, axios } from './serviceOptions';
export const basePath = '/v1';
export class ListResultDto {
    items;
}
export class PagedResultDto {
    totalCount;
    items;
}
export class ProductsTestService {
    /**
     * Product Types
     */
    static productsTest(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/products-test';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = { latitude: params['latitude'], longitude: params['longitude'] };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class ProductsService {
    /**
     * Product Types
     */
    static products(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/products';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = { latitude: params['latitude'], longitude: params['longitude'] };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class EstimatesService {
    /**
     * Price Estimates
     */
    static price(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/estimates/price';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = {
                start_latitude: params['startLatitude'],
                start_longitude: params['startLongitude'],
                end_latitude: params['endLatitude'],
                end_longitude: params['endLongitude']
            };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
    /**
     * Time Estimates
     */
    static time(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/estimates/time';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = {
                start_latitude: params['startLatitude'],
                start_longitude: params['startLongitude'],
                customer_uuid: params['customerUuid'],
                product_id: params['productId']
            };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class UserService {
    /**
     * User Profile
     */
    static me(options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/me';
            const configs = getConfigs('get', 'application/json', url, options);
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
    /**
     * User Activity
     */
    static history(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/history';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = { offset: params['offset'], limit: params['limit'] };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class MappersService {
    /**
     *
     */
    static mapper(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/crawler/v1/mapper/{mapper.id}';
            url = url.replace('{mapper.id}', params['mapperId'] + '');
            const configs = getConfigs('put', 'application/json', url, options);
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class AuditLogService {
    /**
     *
     */
    static getAuditLogs(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/api/services/app/AuditLog/GetAuditLogs';
            const configs = getConfigs('get', 'application/json', url, options);
            configs.params = { StartDate: params['startDate'] };
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class YmTicketTypicalService {
    /**
     * 新增或编辑标准票, 需走审批流程
     */
    static addOrUpdateTicketTypical(options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical';
            const configs = getConfigs('post', 'application/json', url, options);
            let data = null;
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export class DeviceService {
    /**
     * 分页上传设备地理坐标信息, 参数list的值为 List<DeviceLngLat>, 返回Result对象
     */
    static uploadLngLat(params = {}, options = {}) {
        return new Promise((resolve, reject) => {
            let url = basePath + '/dev/uploadLngLat';
            const configs = getConfigs('post', 'application/json', url, options);
            let data = params['list'];
            configs.data = data;
            axios(configs, resolve, reject);
        });
    }
}
export var RoleType;
(function (RoleType) {
    RoleType["Admin"] = "Admin";
    RoleType["User"] = "User";
    RoleType["SetSms"] = "SetSms";
})(RoleType || (RoleType = {}));
export var EnumCreateOrUpdateUserInputUserRights;
(function (EnumCreateOrUpdateUserInputUserRights) {
    EnumCreateOrUpdateUserInputUserRights["View"] = "View";
    EnumCreateOrUpdateUserInputUserRights["Operate"] = "Operate";
    EnumCreateOrUpdateUserInputUserRights["Auth"] = "Auth";
    EnumCreateOrUpdateUserInputUserRights["Search"] = "Search";
    EnumCreateOrUpdateUserInputUserRights["Delete"] = "Delete";
    EnumCreateOrUpdateUserInputUserRights["UserManage"] = "UserManage";
    EnumCreateOrUpdateUserInputUserRights["UserConfig"] = "UserConfig";
    EnumCreateOrUpdateUserInputUserRights["SetTime"] = "SetTime";
    EnumCreateOrUpdateUserInputUserRights["SetNetwork"] = "SetNetwork";
    EnumCreateOrUpdateUserInputUserRights["SetSms"] = "SetSms";
    EnumCreateOrUpdateUserInputUserRights["SystemManage"] = "SystemManage";
})(EnumCreateOrUpdateUserInputUserRights || (EnumCreateOrUpdateUserInputUserRights = {}));
//# sourceMappingURL=index.js.map