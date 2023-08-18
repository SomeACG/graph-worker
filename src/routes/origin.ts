import { Hono } from 'hono'
import cache from './middlewares/thumb-cache'
import type { AppEnv } from '../types/Env';
import GraphAPI from '../api/graph';
import { getImageMIMEType } from '../utils';
import type { ThumbnailSize } from '../types/Graph';

const router = new Hono<AppEnv>()
const CACHE_NAME = 'origin-cache'
const ROUTE_PATH = '/origin/:file_name'

// Check for cloudflare cache
router.get(ROUTE_PATH, cache({ cacheName: CACHE_NAME, cacheControl: 'public, max-age=31536000, immutable' }))

router.get(ROUTE_PATH, async (context) => {

    const graph = new GraphAPI(context.env)
    const file_name = context.req.param('file_name')

    const response = await graph.getImageOrigin(file_name)

    if (response.status !== 200) return context.text('File not found', { status: 404 })

    return new Response(response.body, { status: response.status, headers: { 'Content-Type': getImageMIMEType(file_name) } })
})

export default router;