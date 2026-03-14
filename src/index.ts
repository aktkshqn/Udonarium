import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend integration
app.use('*', cors())

app.get('/', (c) => {
  return c.text('Udonarium Lily Backend API')
})

/**
 * Phase 1: Chat Logging
 * SQLite Table: chat_logs (room_id, sender_name, message, timestamp)
 */

// Retrieve logs for a specific room
app.get('/rooms/:roomId/logs', async (c) => {
  const roomId = c.req.param('roomId')
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, sender_name, message, timestamp, created_at FROM chat_logs WHERE room_id = ? ORDER BY timestamp ASC'
    )
    .bind(roomId)
    .all()
    
    return c.json({
      roomId,
      logs: results
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Add a new log entry
app.post('/rooms/:roomId/logs', async (c) => {
  const roomId = c.req.param('roomId')
  const { sender_name, message, timestamp } = await c.req.json()

  // Basic validation
  if (!sender_name || !message || !timestamp) {
    return c.json({ error: 'Missing required fields: sender_name, message, or timestamp' }, 400)
  }

  try {
    await c.env.DB.prepare(
      'INSERT INTO chat_logs (room_id, sender_name, message, timestamp) VALUES (?, ?, ?, ?)'
    )
    .bind(roomId, sender_name, message, timestamp)
    .run()

    return c.json({ success: true }, 201)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export default app

