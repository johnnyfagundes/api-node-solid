import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: new Decimal(-15.8148327),
      longitude: new Decimal(-48.0704318),
      phone: '',
      description: ''
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8148327,
      userLongitude: -48.0704318
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  //TDD - red, green and refactor
  it('should not be able to check in twice at the same day', async () => {
    vi.setSystemTime(new Date(2022,0,20,8,0,0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8148327,
      userLongitude: -48.0704318
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -15.8148327,
        userLongitude: -48.0704318
      })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022,0,20,8,0,0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8148327,
      userLongitude: -48.0704318
    })

    vi.setSystemTime(new Date(2022,0,21,8,0,0))
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8148327,
      userLongitude: -48.0704318
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in far from the gym', async () => {

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      latitude: new Decimal(-15.8148327),
      longitude: new Decimal(-48.0704318),
      phone: '',
      description: ''
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -15.8204482,
        userLongitude: -48.0656682
      })
    ).rejects.toBeInstanceOf(Error)

  })

})

