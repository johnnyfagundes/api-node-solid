import {FindManyNearbyParams, GymsRepository} from "@/repositories/gyms-repository";
import {prisma} from "@/lib/prisma";
import {Gym, Prisma} from "@prisma/client";

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymUncheckedCreateInput) {
        const gym = await prisma.gym.create({
            data
        })

        return gym
    }

    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id: id
            }
        })
        return gym
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        return gyms
    }

    async searchMany(query: string, page: number) {
        const checkIns = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            skip: (page - 1) * 20,
            take: 20
        })
        return checkIns
    }

}