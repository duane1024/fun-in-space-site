import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    tech: z.array(z.string()).default([]),
  }),
});

const ventures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ventures' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    timeframe: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
  }),
});

const career = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/career' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    timeframe: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    published: z.date(),
    excerpt: z.string(),
    legacyUrl: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const tweets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tweets' }),
  schema: z.object({
    tweetId: z.string(),
    url: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    published: z.date().optional(),
  }),
});

export const collections = {
  projects,
  ventures,
  career,
  writing,
  tweets,
};
