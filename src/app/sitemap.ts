import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

interface BlogPost {
  slug: string
  published_at: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roadmap-nepoex-git-main-ytscripts-projects-49f3f3ac.vercel.app'

  let posts: BlogPost[] = []
  try {
    // Blog yazılarını getir
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('status', 'published')
    
    posts = data || []
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    posts = []
  }

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

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