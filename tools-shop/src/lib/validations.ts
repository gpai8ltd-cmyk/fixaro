import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Имейлът е задължителен')
    .email('Невалиден имейл адрес')
    .max(255, 'Имейлът е твърде дълъг'),
  password: z
    .string()
    .min(1, 'Паролата е задължителна')
    .max(128, 'Паролата е твърде дълга'),
});

// Order/checkout validation schema
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Името трябва да е поне 2 символа')
    .max(50, 'Името е твърде дълго'),
  lastName: z
    .string()
    .min(2, 'Фамилията трябва да е поне 2 символа')
    .max(50, 'Фамилията е твърде дълга'),
  email: z
    .string()
    .email('Невалиден имейл адрес')
    .max(255, 'Имейлът е твърде дълъг'),
  phone: z
    .string()
    .min(10, 'Телефонът трябва да е поне 10 цифри')
    .max(20, 'Телефонът е твърде дълъг')
    .regex(/^[+]?[\d\s-]+$/, 'Невалиден телефонен номер'),
  city: z
    .string()
    .min(2, 'Градът трябва да е поне 2 символа')
    .max(100, 'Името на града е твърде дълго'),
  address: z
    .string()
    .min(5, 'Адресът трябва да е поне 5 символа')
    .max(200, 'Адресът е твърде дълъг'),
  postalCode: z
    .string()
    .min(4, 'Пощенският код трябва да е поне 4 символа')
    .max(10, 'Пощенският код е твърде дълъг')
    .optional(),
  notes: z
    .string()
    .max(500, 'Бележките са твърде дълги')
    .optional(),
  deliveryMethod: z.enum(['econt', 'speedy'], {
    message: 'Изберете валиден метод на доставка',
  }),
});

// Product creation/update validation (admin)
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Името трябва да е поне 2 символа')
    .max(200, 'Името е твърде дълго'),
  slug: z
    .string()
    .min(2, 'Slug трябва да е поне 2 символа')
    .max(200, 'Slug е твърде дълъг')
    .regex(/^[a-z0-9-]+$/, 'Slug може да съдържа само малки букви, цифри и тирета'),
  description: z
    .string()
    .max(5000, 'Описанието е твърде дълго')
    .optional(),
  price: z
    .number()
    .positive('Цената трябва да е положително число')
    .max(99999.99, 'Цената е твърде висока'),
  oldPrice: z
    .number()
    .positive('Старата цена трябва да е положително число')
    .max(99999.99, 'Старата цена е твърде висока')
    .optional()
    .nullable(),
  image: z
    .string()
    .url('Невалиден URL на изображение')
    .max(500, 'URL е твърде дълъг')
    .optional()
    .nullable(),
  categoryId: z
    .string()
    .uuid('Невалиден идентификатор на категория')
    .optional()
    .nullable(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// Category validation (admin)
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Името трябва да е поне 2 символа')
    .max(100, 'Името е твърде дълго'),
  slug: z
    .string()
    .min(2, 'Slug трябва да е поне 2 символа')
    .max(100, 'Slug е твърде дълъг')
    .regex(/^[a-z0-9-]+$/, 'Slug може да съдържа само малки букви, цифри и тирета'),
  description: z
    .string()
    .max(500, 'Описанието е твърде дълго')
    .optional(),
  image: z
    .string()
    .url('Невалиден URL на изображение')
    .max(500, 'URL е твърде дълъг')
    .optional()
    .nullable(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;

// Helper to format Zod errors
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((e) => e.message).join(', ');
}
