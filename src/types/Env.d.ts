export type AppEnv = {
    Bindings: {
        REALM_APPID: string,
        REALM_API_KEY: string,
        CLIENT_ID: string,
        CLIENT_SECRET: string,
        GRAPH_BASE: string,
        kv: KVNamespace
    }
}