'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiGitBranch } from 'react-icons/fi'

interface Repository {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
}

interface GitHubReposProps {
  username: string
}

export default function GitHubRepos({ username }: GitHubReposProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        if (!response.ok) throw new Error('Failed to fetch repos')
        
        const data = await response.json()
        setRepos(data)
      } catch (error) {
        console.error('Error fetching GitHub repos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchRepos()
    }
  }, [username])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/5 rounded-xl p-6">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {repos.map(repo => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">
            {repo.name}
          </h3>
          
          {repo.description && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            {repo.language && (
              <span className="flex items-center gap-1 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                {repo.language}
              </span>
            )}
            
            <span className="flex items-center gap-1 text-gray-400">
              <FiStar className="w-4 h-4" />
              {repo.stargazers_count}
            </span>

            <span className="flex items-center gap-1 text-gray-400">
              <FiGitBranch className="w-4 h-4" />
              {repo.forks_count}
            </span>
          </div>

          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {repo.topics.slice(0, 3).map(topic => (
                <span
                  key={topic}
                  className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </motion.a>
      ))}
    </div>
  )
} 