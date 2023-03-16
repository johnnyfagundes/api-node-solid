import { FastifyInstance } from 'fastify'
import { register } from '@/http/controller/register'
import { authenticate } from '@/http/controller/authenticate'
import { profile } from '@/http/controller/profile'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] } , profile)
}
