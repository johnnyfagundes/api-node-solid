import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from '@/http/controller/check-ins/create'
import { validate } from '@/http/controller/check-ins/validate'
import { metrics } from '@/http/controller/check-ins/metrics'
import { history } from '@/http/controller/check-ins/history'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.patch('/check-ins/:checkInId/validate', validate)
  app.post('/gyms/:gymId/check-in', create)
}
