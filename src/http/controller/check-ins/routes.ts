import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from '@/http/controller/check-ins/create'
import { validate } from '@/http/controller/check-ins/validate'
import { metrics } from '@/http/controller/check-ins/metrics'
import { history } from '@/http/controller/check-ins/history'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
  app.post('/gyms/:gymId/check-in', create)
}
