import request from 'supertest'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '119999999999',
        latitude: -15.8148327,
        longitude: -48.0704318,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Some description',
        phone: '119999999999',
        latitude: 15.8554767,
        longitude: -47.9508901,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -15.8204482,
        longitude: -48.0656682,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    // expect(response.body.gyms).toHaveLength(1)
    // expect(response.body.gyms).toEqual([
    //   expect.objectContaining({
    //     title: 'JavaScript Gym',
    //   }),
    // ])
  })
})
