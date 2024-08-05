import { Injectable, NotFoundException } from '@nestjs/common'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePersonDto } from './dto/create-person.dto'

@Injectable()
export class PersonService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(personData: CreatePersonDto, avatar: Express.Multer.File) {
    try {
      const imageUpload = await this.cloudinary.uploadFile(avatar, 'ns-cinema/person')

      const person = await this.prisma.person.create({
        data: {
          ...personData,
          avatar: imageUpload.url,
        },
      })

      return person
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const persons = await this.prisma.person.findMany()

      return persons
    } catch (error) {
      throw error
    }
  }

  async byId(id: string) {
    try {
      const person = await this.prisma.person.findUnique({
        where: {
          id,
        },
      })

      return person
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const person = await this.prisma.person.findUnique({
        where: {
          id,
        },
        include: {
          movies: true,
        },
      })

      if (!person) {
        throw new NotFoundException('Person not found')
      }

      await this.deleteImageCloudinary(person.avatar)

      if (person.movies.length > 0) throw new NotFoundException('Person has dont delete')

      await this.prisma.person.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Person deleted',
      }
    } catch (error) {
      throw error
    }
  }

  async update(id: string, personData: CreatePersonDto, avatar: Express.Multer.File) {
    try {
      const checkPerson = await this.prisma.person.findUnique({
        where: {
          id,
        },
      })

      if (!checkPerson) {
        throw new NotFoundException('Person not found')
      }

      if (avatar) await this.deleteImageCloudinary(checkPerson.avatar)

      const image = avatar
        ? (await this.cloudinary.uploadFile(avatar, 'ns-person/person')).url
        : checkPerson.avatar

      const person = await this.prisma.person.update({
        where: {
          id,
        },
        data: {
          ...personData,
          avatar: image,
        },
      })

      return person
    } catch (error) {
      throw error
    }
  }

  private deleteImageCloudinary = async (url: string) => {
    const public_id = `ns-cinema/person/${url.split('/').pop().split('.')[0]}`

    await this.cloudinary.bulkDelete([public_id])
  }
}
