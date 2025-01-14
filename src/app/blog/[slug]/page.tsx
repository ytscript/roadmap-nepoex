import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import BlogPostClient from './BlogPostClient'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    return {
      title: '404 - Yazı Bulunamadı',
      description: 'Aradığınız blog yazısı bulunamadı veya yayından kaldırılmış olabilir.',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.published_at,
      authors: ['Your Name'],
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image_url],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  return <BlogPostClient slug={resolvedParams.slug} />
} 