import * as Realm from 'realm-web';
import type { AppEnv } from '../types/Env';

export default class RealmApp {
    app: Realm.App;
    credentials: Realm.Credentials;
    client: globalThis.Realm.Services.MongoDB | undefined;

    constructor (env: AppEnv['Bindings']) {
        this.app = new Realm.App({ id: env.REALM_APPID });
        this.credentials = Realm.Credentials.apiKey(env.REALM_API_KEY);
        this.init(this.credentials);
    }

    async init(credentials: Realm.Credentials) {
        const user = await this.app.logIn(credentials);
        this.client = user.mongoClient('mongodb-atlas')
    }

    async getResfreshToken() {
        if(!this.client) await this.init(this.credentials);

        const configs = this.client?.db('SomeACG_New').collection('configs')

        try {
            let doc = await configs?.findOne({ name: 'refresh_token' })
            return doc?.value
        }
        catch(err) {
            console.log(err)
        }
    }
}