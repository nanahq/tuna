export type NetworkType = "PLAYGROUND" | "PRODUCTION"
export type APIService = 'API_GATEWAY' | 'VENDOR_GATEWAY' | 'ADMIN_GATEWAY'


export const NetworkMapper: Record<NetworkType, string> = {
    PLAYGROUND: 'http://localhost',
    PRODUCTION: process.env.API_URL ?? 'https://api.eatlater.ng'
}


export const PlaygroundServicePort: Record<APIService, number> = {
    API_GATEWAY: 3000,
    VENDOR_GATEWAY: 3001,
    ADMIN_GATEWAY: 3002

}

export const ApiRoute: Record<APIService, string> = {
    API_GATEWAY: `api-gateway`,
    VENDOR_GATEWAY: `vendor-gateway`,
    ADMIN_GATEWAY: `admin-gateway`
}
