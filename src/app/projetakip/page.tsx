'use client'

import TaskBoard from '@/components/ProjectManagement/TaskBoard'
import { motion } from 'framer-motion'

export default function ProjectManagementPage() {
  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      {/* Arkaplan Efekti */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Ana İçerik */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TaskBoard />
      </motion.div>
    </main>
  )
} 