import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@toolsshop.bg' },
    update: {},
    create: {
      email: 'admin@toolsshop.bg',
      password: hashedPassword,
      name: 'Администратор',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create categories
  const elektro = await prisma.category.upsert({
    where: { slug: 'elektro-instrumenti' },
    update: {},
    create: {
      nameBg: 'Електроинструменти',
      nameEn: 'Power Tools',
      slug: 'elektro-instrumenti',
      description: 'Бормашини, винтоверти, ъглошлайфи и други',
    },
  });

  const rachni = await prisma.category.upsert({
    where: { slug: 'rachni-instrumenti' },
    update: {},
    create: {
      nameBg: 'Ръчни инструменти',
      nameEn: 'Hand Tools',
      slug: 'rachni-instrumenti',
      description: 'Гаечни ключове, отвертки, клещи и други',
    },
  });

  const izmer = await prisma.category.upsert({
    where: { slug: 'izmervatelnii-uredi' },
    update: {},
    create: {
      nameBg: 'Измервателни уреди',
      nameEn: 'Measuring Tools',
      slug: 'izmervatelnii-uredi',
      description: 'Нивелири, ролетки, мултицети',
    },
  });

  const gradinski = await prisma.category.upsert({
    where: { slug: 'gradinski-instrumenti' },
    update: {},
    create: {
      nameBg: 'Градински инструменти',
      nameEn: 'Garden Tools',
      slug: 'gradinski-instrumenti',
      description: 'Косачки, тримери, градински ножици',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const products = [
    {
      nameBg: 'Акумулаторен винтоверт 18V Li-Ion',
      nameEn: 'Cordless Drill 18V Li-Ion',
      slug: 'akumulatoren-vintovert-18v',
      descriptionBg: 'Професионален акумулаторен винтоверт с мощна 18V литиево-йонна батерия. Идеален за домашни ремонти и професионална употреба. Въртящ момент 45Nm, 25 позиции.',
      descriptionEn: 'Professional cordless drill with powerful 18V lithium-ion battery. Ideal for home repairs and professional use.',
      price: 189.99,
      oldPrice: 249.99,
      images: JSON.stringify(['/images/products/drill.jpg']),
      stock: 15,
      isActive: true,
      isFeatured: true,
      categoryId: elektro.id,
    },
    {
      nameBg: 'Комплект гаечни ключове 8-22мм',
      nameEn: 'Wrench Set 8-22mm',
      slug: 'komplekt-gaechni-klyuchove',
      descriptionBg: 'Комплект от 12 гаечни ключове с размери от 8мм до 22мм. Изработени от хром-ванадиева стомана за максимална издръжливост.',
      descriptionEn: 'Set of 12 wrenches ranging from 8mm to 22mm. Made from chrome-vanadium steel.',
      price: 45.99,
      oldPrice: null,
      images: JSON.stringify(['/images/products/wrenches.jpg']),
      stock: 42,
      isActive: true,
      isFeatured: true,
      categoryId: rachni.id,
    },
    {
      nameBg: 'Ъглошлайф 125мм 1200W',
      nameEn: 'Angle Grinder 125mm 1200W',
      slug: 'agloshlaif-125mm',
      descriptionBg: 'Мощен ъглошлайф с диск 125мм и мотор 1200W. Подходящ за рязане и шлайфане на метал, камък и бетон.',
      descriptionEn: 'Powerful angle grinder with 125mm disc and 1200W motor. Suitable for cutting and grinding metal.',
      price: 129.99,
      oldPrice: 159.99,
      images: JSON.stringify(['/images/products/grinder.jpg']),
      stock: 8,
      isActive: true,
      isFeatured: true,
      categoryId: elektro.id,
    },
    {
      nameBg: 'Лазерен нивелир с триножник',
      nameEn: 'Laser Level with Tripod',
      slug: 'lazeren-nivelir',
      descriptionBg: 'Прецизен лазерен нивелир с кръстосани линии и триножник. Обхват до 15 метра. Самонивелиране.',
      descriptionEn: 'Precision laser level with cross lines and tripod. Range up to 15 meters.',
      price: 89.99,
      oldPrice: null,
      images: JSON.stringify(['/images/products/level.jpg']),
      stock: 23,
      isActive: true,
      isFeatured: true,
      categoryId: izmer.id,
    },
    {
      nameBg: 'Професионална бормашина 750W',
      nameEn: 'Professional Drill 750W',
      slug: 'professionalna-bormashina',
      descriptionBg: 'Ударна бормашина с мотор 750W. Подходяща за пробиване в бетон, тухла и метал.',
      descriptionEn: 'Impact drill with 750W motor. Suitable for drilling in concrete, brick and metal.',
      price: 149.99,
      oldPrice: 179.99,
      images: JSON.stringify(['/images/products/drill2.jpg']),
      stock: 12,
      isActive: true,
      isFeatured: false,
      categoryId: elektro.id,
    },
    {
      nameBg: 'Комплект отвертки 12 части',
      nameEn: 'Screwdriver Set 12 pcs',
      slug: 'komplekt-otvertki-12',
      descriptionBg: 'Комплект от 12 отвертки с различни размери и видове накрайници. Ергономични дръжки.',
      descriptionEn: 'Set of 12 screwdrivers with different sizes and tip types. Ergonomic handles.',
      price: 29.99,
      oldPrice: null,
      images: JSON.stringify(['/images/products/screwdrivers.jpg']),
      stock: 35,
      isActive: true,
      isFeatured: false,
      categoryId: rachni.id,
    },
    {
      nameBg: 'Електрически трион 1800W',
      nameEn: 'Electric Saw 1800W',
      slug: 'elektricheski-trion',
      descriptionBg: 'Мощен циркуляр с диск 185мм и мотор 1800W. Дълбочина на рязане до 65мм.',
      descriptionEn: 'Powerful circular saw with 185mm disc and 1800W motor. Cutting depth up to 65mm.',
      price: 219.99,
      oldPrice: 289.99,
      images: JSON.stringify(['/images/products/saw.jpg']),
      stock: 6,
      isActive: true,
      isFeatured: false,
      categoryId: elektro.id,
    },
    {
      nameBg: 'Мултицет цифров',
      nameEn: 'Digital Multimeter',
      slug: 'multitset-tsifrov',
      descriptionBg: 'Цифров мултицет за измерване на напрежение, ток, съпротивление. Автоматичен обхват.',
      descriptionEn: 'Digital multimeter for measuring voltage, current, resistance. Auto-ranging.',
      price: 34.99,
      oldPrice: null,
      images: JSON.stringify(['/images/products/multimeter.jpg']),
      stock: 28,
      isActive: true,
      isFeatured: false,
      categoryId: izmer.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('✅ Products created:', products.length);

  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📧 Admin login: admin@toolsshop.bg');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
