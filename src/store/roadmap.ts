import { create } from 'zustand'
import { RoadmapCard } from '@/lib/supabase/roadmap'

interface RoadmapStore {
  frontendCards: RoadmapCard[]
  backendCards: RoadmapCard[]
  devopsCards: RoadmapCard[]
  mobileCards: RoadmapCard[]
  setCards: (category: 'frontend' | 'backend' | 'devops' | 'mobile', cards: RoadmapCard[]) => void
  getCards: (category: 'frontend' | 'backend' | 'devops' | 'mobile') => RoadmapCard[]
  updateTopicStatus: (
    category: 'frontend' | 'backend' | 'devops' | 'mobile',
    cardId: string,
    topicId: string,
    completed: boolean
  ) => void
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  frontendCards: [],
  backendCards: [],
  devopsCards: [],
  mobileCards: [],

  setCards: (category, cards) => {
    set({ [`${category}Cards`]: cards })
  },

  getCards: (category) => {
    return get()[`${category}Cards`]
  },

  updateTopicStatus: (category, cardId, topicId, completed) => {
    set((state) => {
      const cards = state[`${category}Cards`]
      const updatedCards = cards.map(card => {
        if (card.id === cardId) {
          const updatedTopics = card.topics.map(topic => {
            if (topic.id === topicId) {
              return { ...topic, completed: !completed }
            }
            return topic
          })

          const completedTopicsCount = updatedTopics.filter(t => t.completed).length
          const newXP = completedTopicsCount * 25

          return {
            ...card,
            topics: updatedTopics,
            xp: newXP
          }
        }
        return card
      })

      return { [`${category}Cards`]: updatedCards }
    })
  }
})) 