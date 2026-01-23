require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = bcrypt.hashSync('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@toolsshop.bg' },
    update: {},
    create: {
      email: 'admin@toolsshop.bg',
      password: hashedPassword,
      name: 'Admin User',
    },
  })
  console.log('Admin created:', admin.email)

  const categories = [
    {
      nameBg: 'Електроинструменти',
      nameEn: 'Power Tools',
      slug: 'power-tools',
      description: 'Винтоверти, бормашини',
    },
    {
      nameBg: 'Ръчни инструменти',
      nameEn: 'Hand Tools',
      slug: 'hand-tools',
      description: 'Чукове, отвертки',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories created')

  const powerTools = await prisma.category.findUnique({ where: { slug: 'power-tools' } })
  if (!powerTools) throw new Error('Category not found')

  const products = [
    {
      nameBg: 'Винтоверт 18V',
      nameEn: 'Drill 18V',
      slug: 'drill-18v',
      descriptionBg: 'Професионален винтоверт',
      descriptionEn: 'Professional drill',
      price: 249.99,
      oldPrice: 299.99,
      images: JSON.stringify(['/images/drill.jpg']),
      stock: 15,
      isActive: true,
      isFeatured: true,
      categoryId: powerTools.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('Products created')
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
