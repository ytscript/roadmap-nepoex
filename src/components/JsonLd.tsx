interface BlogPostJsonLdProps {
  title: string
  description: string
  publishedAt: string
  author: string
  url: string
  imageUrl: string
}

export function BlogPostJsonLd({
  title,
  description,
  publishedAt,
  author,
  url,
  imageUrl,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kod Günlüğü',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-domain.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 