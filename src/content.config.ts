import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Brand/category icon shown beside the page title.
				// Key maps to an icon in src/components/PageTitle.astro.
				titleIcon: z.string().optional(),
				// Optional accent color name (e.g. "amber") to tint a monochrome title icon.
				titleIconAccent: z.string().optional(),
			}),
		}),
	}),
};
