import type { AppEnv } from "../types/Env"
import type { ThumbnailSize } from "../types/Graph"


export default class GraphAPI {
    refresh_token: string
    access_token: string | undefined
    env: AppEnv['Bindings']

    constructor(refresh_token: string, env: AppEnv['Bindings']) {
        this.refresh_token = refresh_token
        this.env = env
    }

    async fetchAccessToken() {
        let access_token = await this.env.kv.get('access_token')

        if(!access_token) {

            const body = new URLSearchParams();

            body.append('client_id', this.env.CLIENT_ID);
            body.append('client_secret', this.env.CLIENT_SECRET);
            body.append('refresh_token', this.refresh_token);
            body.append('redirect_uri', 'http://localhost');
            body.append('grant_type', 'refresh_token');

            const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            })

            const json = await response.json<Record<'access_token' | 'expires_in', string>>()

            access_token = json.access_token

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
}