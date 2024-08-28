import {ApiRoute, APIService} from "@api/network.mapper";
import axios, { Method} from 'axios'
import {persistence} from "@api/persistence";
import { showToastStandard } from "@components/commons/Toast";
import {cookieParser} from "../../utils/cookieParser";
export  function getUrl (gateway: APIService = "VENDOR_GATEWAY"): string {
    return `https://prod-api.trynanaapp.com/${ApiRoute[gateway]}/v1`
}

const config = {
    baseUrl: getUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true
};

interface baseParamProps<T> {
    method: Method
    url: string
    data?: T
    type?: 'requestData'
    headers?: any
    transformRequest?: any

    baseUrl?: string
}

async function base<T>(param: baseParamProps<T>) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setTimeout(() => {
        source.cancel();
    }, 50000);
    console.log(param.data)
    return await axios({
        method: param.method,
        baseURL: param.baseUrl ?? config.baseUrl,
        url: param.url,
        headers: param.headers !== undefined ?  param.headers : config.headers,
        cancelToken: source.token,
        data: param.data,
    })
      .then(res => {
            return Promise.resolve({
                data: res?.data,
                cookies: res.headers['set-cookie'] ?? []
            });
        })
        .catch((err: any) => {
            console.error(err)
            if (err.message.includes('401')) {
                return Promise.reject(err.response?.data);
            }
            if (err.response) {
                return Promise.reject(err.response?.data);
            }
            showToastStandard('Something went wrong', 'error')

            return Promise.reject(err);
        })
}

async function request<T> (method: Method, url: string): Promise<{data: any, cookies: string[]}> {
    return await base<T>({method, url})
        .then(res => {
            if ( res.cookies.length > 0) {
            persistence.setSecure(cookieParser(res.cookies[0]))
           }
           return Promise.resolve<{data: any, cookies: string[]}>(res)
        })
        .catch(err => Promise.reject(err));
}

async function requestData<T> (params: baseParamProps<T>): Promise<{data: any, cookies: string[]}> {
    return await base<T>(params)
        .then(res => Promise.resolve<{data: any, cookies: string[]}>(res))
        .catch(err => Promise.reject(err));
}
export const _api = {
    request,
    requestData,
};
