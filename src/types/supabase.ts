export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roadmap_cards: {
        Row: {
          id: string
          title: string
          description: string
          level: 'beginner' | 'intermediate' | 'advanced'
          status: 'locked' | 'in-progress' | 'completed'
          xp: number
          required_xp: number | null
          order_number: number
          estimated_time: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          level: 'beginner' | 'intermediate' | 'advanced'
          status?: 'locked' | 'in-progress' | 'completed'
          xp?: number
          required_xp?: number | null
          order_number: number
          estimated_time?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          status?: 'locked' | 'in-progress' | 'completed'
          xp?: number
          required_xp?: number | null
          order_number?: number
          estimated_time?: string
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          card_id: string
          title: string
          description: string
          completed: boolean
          order_number: number
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          title: string
          description: string
          completed?: boolean
          order_number: number
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          title?: string
          description?: string
          completed?: boolean
          order_number?: number
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          topic_id: string
          title: string
          url: string
          type: 'article' | 'video' | 'github' | 'demo'
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          title: string
          url: string
          type: 'article' | 'video' | 'github' | 'demo'
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          title?: string
          url?: string
          type?: 'article' | 'video' | 'github' | 'demo'
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          user_id: string
          card_id: string
          topic_id: string
          completed_at: string
          earned_xp: number
        }
        Insert: {
          user_id: string
          card_id: string
          topic_id: string
          completed_at?: string
          earned_xp?: number
        }
        Update: {
          user_id?: string
          card_id?: string
          topic_id?: string
          completed_at?: string
          earned_xp?: number
        }
      }
      card_prerequisites: {
        Row: {
          card_id: string
          prerequisite_id: string
        }
        Insert: {
          card_id: string
          prerequisite_id: string
        }
        Update: {
          card_id?: string
          prerequisite_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 