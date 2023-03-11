import { FastifyInstance } from 'fastify'
import { register } from '@/http/controller/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
