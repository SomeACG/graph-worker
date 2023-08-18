## SomeACG CDN Worker

This is the source code of SomeACG Cloudflare Worker for Thumbnails CDN.

### Config Guide

It need a MongoDB Altas instance for Microsoft Graph API Tokens Storage, please refer to: [SomeACG-Bot](https://github.com/SomeACG/SomeACG-Bot).

Then copy `wrangler.example.toml` to `wrangler.toml`, fill in your Cloudflare Account ID. You will also need to create a Cloudflare Worker KV instance and fill the Worker ID to the `bindings`.

There are two vars you will also to modify in the `wrangler.toml`:

- REALM_APPID: MongoDB Realm APP API Key.

- GRAPH_BASE: The base path of your OneDrive that you want to share with.

For local development and production deployment, you will need these Environment Variables: 

- REALM_API_KEY: MongoDB Realm APP API Key.

- CLIENT_ID: Grapgh API Client ID

- CLIENT_SECRET: Grapgh API Client Secret

Create the `.dev.vars` file to configure the environment variables above in local development, then use The [Wranger CLI](https://developers.cloudflare.com/workers/wrangler) to start the dev server.
