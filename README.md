## SomeACG CDN Worker

This is the source code of SomeACG Cloudflare Worker for Thumbnails CDN.

### Config Guide

Copy `wrangler.example.toml` to `wrangler.toml`, fill in your Cloudflare Account ID. You will also need to create a Cloudflare Worker KV instance and fill the Worker ID to the `bindings`.

You will also need to modify in the `wrangler.toml` to set up the following variables:

- GRAPH_BASE: The base path of your OneDrive that you want to share with.

For local development and production deployment, you will need these Environment Variables: 

- CLIENT_ID: Grapgh API Client ID

- CLIENT_SECRET: Grapgh API Client Secret

When the configuration steps above is finished, run `yarn deploy` to deploy your worker to Cloudflare.

After first deployed, you will need to add the `refresh_token` field to your Cloudflare Worker KV. You can get your refresh token with [Rclone](https://rclone.org/):

```bash

$ rclone authorize "onedrive" "CLIENT_ID" "CLIENT_SECRET"

```

You will get a JSON object on you console output if the command ran successfully. Find out the `refresh_token` field and copy its value, add the value to your Cloudflare Worker KV. And all the set-up steps are done.

If you need to develop or run the worker locally, you can create the `.dev.vars` file to configure the environment variables above in local development, then use The [Wranger CLI](https://developers.cloudflare.com/workers/wrangler) to start the dev server.
