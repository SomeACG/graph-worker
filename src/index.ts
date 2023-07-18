import { Hono } from 'hono'
import thumbRouter from './routes/thumbnail'

const app = new Hono()

app.use('*', async (context, next) => {
    console.log(`Request: ${context.req.url}`)
    await next()
})

app.route('/graph', thumbRouter)

// Export for discoverability
export default app;
