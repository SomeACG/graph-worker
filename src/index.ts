import { Hono } from 'hono'
import thumbRouter from './routes/thumbnail'
import originRouter from './routes/origin'

const app = new Hono()

app.use('*', async (context, next) => {
    console.log(`Request: ${context.req.url}`)
    await next()
})

app.route('/graph', thumbRouter)
app.route('/graph', originRouter)

// Export for discoverability
export default app;
