import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto'

const prisma = new PrismaClient()

async function main() {
  const hashPassword = await argon2.hash('admin@123')
  const admin = await prisma.user.upsert({
    where: { email: 'thinh221201@gmail.com' },
    update: {},
    create: {
      email: 'thinh221201@gmail.com',
      password: hashPassword,
      role_user: 'ADMIN',
      first_name: 'Thinh',
      last_name: 'Tran',
      email_verified: new Date(),
    },
  })

  const product = await prisma.food.upsert({
    where: { id: 'fe9aaddf-9920-4285-9dba-0c304ae9d248' },
    update: {},
    create: {
      id: 'fe9aaddf-9920-4285-9dba-0c304ae9d248',
      name: 'BANH MY',
      description: 'SASUKE',
      price: 123344,
      image: 'https://i.imgur.com/GpYuge8.jpeg',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  const movieType = await prisma.movieType.upsert({
    where: { id: '41f20c30-23ac-4630-b281-613e7cf4d6ca' },
    update: {},
    create: {
      id: '41f20c30-23ac-4630-b281-613e7cf4d6ca',
      name: 'Phim hành động',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  const movieFormat = await prisma.movieFormat.upsert({
    where: { id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc' },
    update: {},
    create: {
      id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      name: '2D',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  const actor = await prisma.person.upsert({
    where: { id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc' },
    update: {},
    create: {
      id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      avatar:
        'https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcRPdd7rOKxJOwHs4u6bL8DtqSxJ6fmoXILAyeVh6nOtCUS7ei2Jzq-4w6eTVZXAVfWr',
      name: 'Thành Long',
      biography:
        'Phòng Sĩ Long SBS MBE PMW, hay Trần Cảng Sinh, thường được biết đến với nghệ danh Thành Long, là một nam diễn viên, nhà làm phim, võ sĩ, nhà chỉ đạo võ thuật và diễn viên đóng thế người Hồng Kông.',
      position: 'ACTOR',
      date_of_birth: '1982-12-12T09:47:57.465Z',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  const producer = await prisma.person.upsert({
    where: { id: '2b6653e3-c1b9-4d82-ab62-034b049e6bbc' },
    update: {},
    create: {
      id: '2b6653e3-c1b9-4d82-ab62-034b049e6bbc',
      avatar:
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTkNWYlJDHrk5Lkkw9yKigwLce0kKPNH7s7V8E4KqcIFempzMxN',
      name: 'Mike Mitchell',
      biography:
        'Mike Mitchell là một đạo diễn điện ảnh, nhà sản xuất, diễn viên và cựu nghệ sĩ hoạt hình Mỹ. Anh là đạo diễn của phim điện ảnh Sky High, Shrek Forever After, Alvin and the Chipmunks 3 và Quỷ lùn tinh nghịch. ',
      position: 'PRODUCER',
      date_of_birth: '1967-12-12T09:47:57.465Z',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  const movie = await prisma.movie.upsert({
    where: { id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc' },
    update: {},
    create: {
      id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      name: 'Kung Fu Panda 4',
      brief_movie:
        'Kung Fu Panda 4 là một bộ phim hoạt hình hài võ thuật sắp ra mắt do DreamWorks Animation sản xuất và Universal Pictures phân phối. Đây là phần thứ tư trong loạt phim Kung Fu Panda và là phần tiếp theo của Kung Fu Panda 3.',
      duration: 120,
      language_movie: 'English',
      limit_age: '18',
      national: 'United States',
      released_date: '2023-12-22T09:47:57.465Z',
      trailer_movie: '',
      movie_format_id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      movie_type_id: '41f20c30-23ac-4630-b281-613e7cf4d6ca',
      ticket_price: 120000,
      movie_image: {
        createMany: {
          data: [
            {
              path: 'https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2023/12/15/1-17026147728041351023244.jpg',
            },
            {
              path: 'https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2023/12/15/2-17026149635561145452931.jpg',
            },
            {
              path: 'https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/12/16/kung-fu-panda-4-3-1702711362407950487236.jpg',
            },
          ],
        },
      },
      persons: {
        createMany: {
          data: [
            {
              person_id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
            },
            {
              person_id: '2b6653e3-c1b9-4d82-ab62-034b049e6bbc',
            },
          ],
        },
      },
    },
  })

  const cinema = await prisma.cinema.upsert({
    where: { id: '35f9fd77-55c4-4255-aca3-6ce6d99e8d9a' },
    update: {},
    create: {
      id: '35f9fd77-55c4-4255-aca3-6ce6d99e8d9a',
      name: 'NS HA NAM',
      phone_number: '0987654321',
      image:
        'https://www.cgv.vn/media/site/cache/1/980x415/b58515f018eb873dafa430b6f9ae0c1e/k/l/klg_4105.jpg',
      address: 'Le Hong Phong, Phu Ly, Ha Nam',
      is_active: true,
      created_at: '2023-12-19T04:08:57.164Z',
      updated_at: '2023-12-19T04:08:57.164Z',
    },
  })

  const screen = await prisma.screen.upsert({
    where: { id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc' },
    update: {},
    create: {
      id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      cinema_id: '35f9fd77-55c4-4255-aca3-6ce6d99e8d9a',
      column_size: 10,
      name: 'PHONG 5',
      row_size: 10,
    },
  })

  const seats: CreateSeatDto[] = []
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] // assuming 10 columns labeled A-J

  for (let i = 0; i < screen.row_size; i++) {
    for (let j = 1; j <= screen.column_size; j++) {
      seats.push({
        row: columns[i],
        column: j,
        screen_id: screen.id,
        seat_type: 'NORMAL',
        name: j < 10 ? `${columns[i]}0${j}` : `${columns[i]}${j}`,
      })
    }
  }

  const seat = await prisma.seat.createMany({
    data: seats,
  })

  const schedule = await prisma.schedule.upsert({
    where: { id: '35f9fd77-55c4-4255-aca3-6ce6d99e8d9a' },
    update: {},
    create: {
      id: '35f9fd77-55c4-4255-aca3-6ce6d99e8d9a',
      start_time: '2024-01-04T09:47:57.465Z',
      end_time: '2024-01-04T09:47:57.465Z',
      movie_id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
      screen_id: '2b6653e3-c1b9-4d82-ab62-034b049e64bc',
    },
  })

  console.log('SEED DATA START')
  console.log({ SCHEDULE: schedule })
  console.log({ SCREEN: screen })
  console.log({ ACTOR: actor })
  console.log({ CINEMA: cinema })
  console.log({ PRODUCER: producer })
  console.log({ MOVIE_TYPE: movieType })
  console.log({ MOVIE_FORMAT: movieFormat })
  console.log({ MOVIE: movie })
  console.log({ ACCOUNT: admin })
  console.log({ PRODUCT: product })
  console.log({ SEAT: seat })
  console.log('SEED DATA END')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
