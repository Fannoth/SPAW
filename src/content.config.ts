import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/services' }),
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    shortDescription: z.string(),
    order: z.number().default(0),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    mainImage: z.string().optional().default(''),
    gallery: z.array(z.string()).optional().default([]),
    date: z.string().optional(),
    featured: z.boolean().default(false),
  }),
})

const pricing = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/pricing' }),
  schema: z.object({
    service: z.string(),
    priceFrom: z.number(),
    priceTo: z.number(),
    unit: z.string(),
    notes: z.string().optional().default(''),
    order: z.number().default(0),
  }),
})

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    content: z.string(),
    rating: z.number().default(5),
    order: z.number().default(0),
  }),
})

const faq = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
})

const certificates = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/certificates' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
  }),
})

const process = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/process' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stepNumber: z.number().default(1),
    icon: z.string(),
  }),
})

const singletons = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/singletons' }),
  schema: z.object({}).passthrough(),
})

export const collections = {
  services,
  projects,
  pricing,
  testimonials,
  faq,
  certificates,
  process,
  singletons,
}
