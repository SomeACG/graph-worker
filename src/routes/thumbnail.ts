import { Hono } from 'hono'
import cache from './middlewares/thumb-cache'
import RealmApp from '../api/realm';
import type { AppEnv } from '../types/Env';
import GraphAPI from '../api/graph';
import { getImageMIMEType } from '../utils';
import type { ThumbnailSize } from '../types/Graph';

const router = new Hono<AppEnv>()
const CACHE_NAME = 'thumb-cache'
const ROUTE_PATH = '/thumb/:file_name'

// Check for cloudflare cache
router.get(ROUTE_PATH, cache({ cacheName: CACHE_NAME }))

router.get(ROUTE_PATH, async (context) => {
    const realm = new RealmApp(context.env);
    const refresh_token = await realm.getResfreshToken()

    const graph = new GraphAPI(refresh_token, context.env)
    const file_name = context.req.param('file_name')

    const response = await graph.getImageThumbnail(
        file_name, 
        context.req.query('size') ? context.req.query('size') as ThumbnailSize: 'large'
    )

    if (response.status !== 200) return context.text('File not found', { status: 404 })

    const cache = await caches.open(CACHE_NAME)

    console.log('Request url:',context.req.url);

    const body_tee = response.body?.tee()

    if (!body_tee) return context.text('Not found', { status: 404 })

    await cache.put(context.req.url, new Response(body_tee[0], { headers: { 'Content-Type': getImageMIMEType(file_name) } }))

    return new Response(body_tee[1], { status: response.status, headers: { 'Content-Type': getImageMIMEType(file_name) } })
})

export default router;