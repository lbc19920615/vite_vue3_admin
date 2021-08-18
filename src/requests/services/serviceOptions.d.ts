/** Generate by swagger-axios-codegen */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface IRequestOptions extends AxiosRequestConfig {
}
export interface IRequestConfig {
    method?: any;
    headers?: any;
    url?: any;
    data?: any;
    params?: any;
}
export interface ServiceOptions {
    axios?: AxiosInstance;
}
export declare const serviceOptions: ServiceOptions;
export declare function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any>;
export declare function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig;
