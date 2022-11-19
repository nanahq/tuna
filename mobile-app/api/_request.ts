import {ApiRoute, APIService, NetworkMapper, PlaygroundServicePort} from "@api/network.mapper";
import axios, {Method, AxiosError} from 'axios'

export  function getUrl (gateway: APIService = "API_GATEWAY"): string {
    const environment = process.env.NODE_ENV

    let url: string

    if (environment === '') {
        url =   `${NetworkMapper.PLAYGROUND}:${PlaygroundServicePort[gateway]}/${ApiRoute[gateway]}/v1`
    } else  {
        url =`${NetworkMapper.PRODUCTION}/${ApiRoute[gateway]}/v1`
    }

    return url
}

const config = {
    baseUrl: getUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

interface baseParamProps {
    method: Method
    url: string
    data?: any
}

async function base (param: baseParamProps) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setTimeout(() => {
        source.cancel();
    }, 10000);
    return await axios({
        method: param.method,
        baseURL: config.baseUrl,
        url: param.url,
        headers: config.headers,
        cancelToken: source.token,
        data: param.data,
    })
        .then(res => {
            return Promise.resolve({
                data: res?.data,
                cookies: res.headers['set-cookie'] ?? []
            });
        })
        .catch((err: AxiosError) => {
            if (err.response) {
                return Promise.reject(err.response?.data);
            }

            return Promise.reject('TIMEOUT');
        });
}


const request = async (method: Method, url: string) => {
    return await base({method, url})
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err));
};

const requestData = async ({method, url, data}: baseParamProps ) => {
    return await base({method, url, data})
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err));
};

export const _api = {
    request,
    requestData,
};
