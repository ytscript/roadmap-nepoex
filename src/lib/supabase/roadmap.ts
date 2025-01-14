import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { supabase } from '../supabase';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'github' | 'demo';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order_number: number;
  resources: Resource[];
}

export interface RoadmapCard {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'locked' | 'in-progress' | 'completed';
  category: 'frontend' | 'backend' | 'devops' | 'mobile';
  xp: number;
  required_xp: number | null;
  order_number: number;
  estimated_time: string;
  created_at: string;
  topics: Topic[];
}

export async function fetchRoadmapCards(category: 'frontend' | 'backend' | 'devops' | 'mobile') {
  try {
    const { data: cards, error: cardsError } = await supabase
      .from('roadmap_cards')
      .select('*')
      .eq('category', category)
      .order('order_number');

    if (cardsError) throw cardsError;

    const cardsWithTopics: RoadmapCard[] = [];

    for (const card of cards) {
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('card_id', card.id)
        .order('order_number');

      if (topicsError) throw topicsError;

      const topicsWithResources = [];

      for (const topic of topics) {
        const { data: resources, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .eq('topic_id', topic.id);

        if (resourcesError) throw resourcesError;

        topicsWithResources.push({
          ...topic,
          resources: resources || []
        });
      }

      cardsWithTopics.push({
        ...card,
        topics: topicsWithResources
      });
    }

    return cardsWithTopics;
  } catch (error) {
    console.error('Error fetching roadmap cards:', error);
    throw error;
  }
}

export async function fetchUserProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function markTopicAsCompleted(userId: string, cardId: string, topicId: string) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        card_id: cardId,
        topic_id: topicId,
        completed_at: new Date().toISOString(),
        earned_xp: 25
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error marking topic as completed:', error);
    throw error;
  }
}

export async function unmarkTopicAsCompleted(userId: string, cardId: string, topicId: string) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .match({
        user_id: userId,
        card_id: cardId,
        topic_id: topicId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error unmarking topic:', error);
    throw error;
  }
}

export async function isCardUnlocked(cardId: string) {
  try {
    const { data: prerequisites, error } = await supabase
      .from('card_prerequisites')
      .select('prerequisite_id')
      .eq('card_id', cardId);

    if (error) throw error;

    if (!prerequisites || prerequisites.length === 0) {
      return true; // No prerequisites means the card is unlocked
    }

    // Check if all prerequisite cards are completed
    for (const { prerequisite_id } of prerequisites) {
      const { data: card, error: cardError } = await supabase
        .from('roadmap_cards')
        .select('status')
        .eq('id', prerequisite_id)
        .single();

      if (cardError) throw cardError;

      if (!card || card.status !== 'completed') {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking if card is unlocked:', error);
    throw error;
  }
} 