import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '@/use-cases/erros/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID

// D - Dependency Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ name, email, password }: RegisterUseCaseRequest) {

    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}
