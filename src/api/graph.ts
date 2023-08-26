import type { AppEnv } from "../types/Env"
import type { ThumbnailSize } from "../types/Graph"

interface ThumbResponse {
    value: {
        c9600x9600: {
            url: string
        }
    }[]
}

export default class GraphAPI {
    refresh_token: string | undefined
    access_token: string | undefined
    env: AppEnv['Bindings']

    constructor(env: AppEnv['Bindings']) {
        this.env = env
    }

    async fetchAccessToken(update_refresh_token?: boolean) {
        let access_token = await this.env.kv.get('access_token', { cacheTtl: 60 })

        let refresh_token = await this.env.kv.get('refresh_token', { cacheTtl: 60 }) as string

        if(update_refresh_token || !access_token) {

            const body = new URLSearchParams();

            body.append('client_id', this.env.CLIENT_ID);
            body.append('client_secret', this.env.CLIENT_SECRET);
            body.append('refresh_token', refresh_token);
            body.append('redirect_uri', 'http://localhost');
            body.append('grant_type', 'refresh_token');

            const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            })

            const json = await response.json<Record<'refresh_token' | 'access_token' | 'expires_in', string>>()

            access_token = json.access_token

            if(update_refresh_token) {

                await this.env.kv.put('refresh_token', json.refresh_token)        
            }

            await this.env.kv.put('access_token', access_token, { expirationTtl: parseInt(json.expires_in) })
        }

        return access_token
    }

    async getImageThumbnail(file_name: string, size?: ThumbnailSize) {
        const access_token = await this.fetchAccessToken()

        if(!size) size = 'large'
        return await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${this.env.GRAPH_BASE}/${file_name}:/thumbnails/0/${size}/content`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${ access_token }` }
        })
    }

    async getImageOrigin(file_name: string) {
        const access_token = await this.fetchAccessToken()

        const resp =  await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${this.env.GRAPH_BASE}/${file_name}:/thumbnails?select=c9600x9600`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${ access_token }` }
        })

        const thumb = await resp.json<ThumbResponse>()

        return await fetch(thumb.value[0].c9600x9600.url, {
            method: 'GET',
        })
    }
}