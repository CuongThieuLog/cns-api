import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloundinary: CloudinaryService,
  ) {}

  async me(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) throw new UnauthorizedException('User not found')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return {
      ...userWithoutPassword,
    }
  }

  async update(id: string, data: UpdateProfileDto, file: Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      })

      if (!user) throw new UnauthorizedException('User not found')
      if (file && user.avatar) await this.deleteImageCloudinary(user.avatar)

      const avatar = file
        ? (await this.cloundinary.uploadFile(file, 'ns-cinema/avatar')).url
        : user.avatar

      const userUpdate = await this.prisma.user.update({
        where: { id },
        data: { ...data, avatar },
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userUpdate

      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  private deleteImageCloudinary = async (url: string) => {
    const public_id = `ns-cinema/avatar/${url.split('/').pop().split('.')[0]}`

    await this.cloundinary.bulkDelete([public_id])
  }
}
