import type { APIRoute } from 'astro'
import fs from 'node:fs/promises'
import path from 'node:path'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const { name, email, phone, message } = data

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Wypełnij wymagane pola' }), { status: 400 })
  }

  const timestamp = new Date().toISOString()
  const slug = `${timestamp.slice(0, 10)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`
  const dirPath = path.join(process.cwd(), 'src/content/submissions', slug)

  await fs.mkdir(dirPath, { recursive: true })
  await fs.writeFile(
    path.join(dirPath, 'index.yaml'),
    [
      `name: "${name}"`,
      `email: "${email}"`,
      `phone: "${phone || ''}"`,
      `message: "${message.replace(/"/g, '\\"')}"`,
      `createdAt: "${timestamp}"`,
    ].join('\n')
  )

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
