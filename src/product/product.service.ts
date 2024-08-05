import { BadRequestException, Injectable } from '@nestjs/common'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloundinary: CloudinaryService,
  ) {}

  async create(data: CreateProductDto, file: Express.Multer.File) {
    const { name, description, price } = data

    try {
      if (!file) throw new BadRequestException('Image is required')
      const image = await this.cloundinary.uploadFile(file, 'ns-cinema/product')
      console.log(image)

      const product = await this.prisma.food.create({
        data: {
          name,
          description,
          price,
          image: image.url,
        },
      })

      return product
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }
  }

  async update(id: string, data: CreateProductDto, file: Express.Multer.File) {
    try {
      const checkProduct = await this.prisma.food.findUnique({
        where: {
          id,
        },
      })

      if (!checkProduct) throw new BadRequestException('Product not found')

      if (file) await this.deleteImageCloudinary(checkProduct.image)

      const image = file
        ? (await this.cloundinary.uploadFile(file, 'ns-cinema/product')).url
        : checkProduct.image

      const product = await this.prisma.food.update({
        where: {
          id,
        },
        data: {
          ...data,
          image,
        },
      })

      return product
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const products = await this.prisma.food.findMany()

      return products
    } catch (error) {
      throw error
    }
  }

  async byId(id: string) {
    try {
      const product = await this.prisma.food.findFirst({
        where: {
          id,
        },
      })

      if (!product) throw new BadRequestException('Product not found')

      return product
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const product = await this.prisma.food.findUnique({
        where: {
          id,
        },
        include: {
          tickets: true,
        },
      })

      if (!product) throw new BadRequestException('Product not found')
      if (product.tickets.length > 0) throw new BadRequestException('Product has dont delete')
      await this.deleteImageCloudinary(product.image)

      await this.prisma.food.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Delete product successfully',
      }
    } catch (error) {
      throw error
    }
  }

  private deleteImageCloudinary = async (url: string) => {
    const public_id = `ns-cinema/product/${url.split('/').pop().split('.')[0]}`

    await this.cloundinary.bulkDelete([public_id])
  }
}
