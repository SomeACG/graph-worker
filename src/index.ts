import { Hono } from 'hono'
import thumbRouter from './routes/thumbnail'

const app = new Hono()

app.get('/', context => {
    return context.text('What are you looking for?')
})

app.route('/graph', thumbRouter)

// Export for discoverability
export default app;
