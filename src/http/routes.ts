import { FastifyInstance } from 'fastify'
import { register } from '@/http/controller/register'
import { authenticate } from '@/http/controller/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
