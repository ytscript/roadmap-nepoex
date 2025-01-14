import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roadmap-nepoex-git-main-ytscripts-projects-49f3f3ac.vercel.app'

  // Blog yazılarını getir
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .eq('status', 'published')

  const blogUrls = posts?.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Statik sayfalar
  const routes = [
    '',
    '/blog',
    '/hakkimda',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes, ...blogUrls]
} 