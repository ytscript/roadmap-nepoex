import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { VscBug, VscTasklist, VscRocket, VscFlame, VscGitPullRequest } from 'react-icons/vsc'
import { BiGitBranch } from 'react-icons/bi'

export interface Task {
  id: string
  title: string
  description: string
  type: 'bug' | 'feature' | 'enhancement' | 'refactor' | 'docs' | 'pr'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: string
  assignee?: string
  dueDate?: string
  labels: string[]
  branch?: string
}

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const typeIcons = {
  bug: <VscBug className="w-5 h-5 text-red-400" />,
  feature: <VscRocket className="w-5 h-5 text-blue-400" />,
  enhancement: <VscTasklist className="w-5 h-5 text-green-400" />,
  refactor: <VscFlame className="w-5 h-5 text-yellow-400" />,
  docs: <VscTasklist className="w-5 h-5 text-purple-400" />,
  pr: <VscGitPullRequest className="w-5 h-5 text-cyan-400" />
}

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400'
}

const statusLabels = {
  backlog: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  'in-review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  }

  const renderLabels = () => {
    const statusLabel = task.labels.find(label => label === 'backlog' || label === 'in-review')
    const regularLabels = task.labels.filter(label => label !== 'backlog' && label !== 'in-review')

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {statusLabel && (
          <span
            className={`px-2 py-1 rounded-full text-xs border ${statusLabels[statusLabel as keyof typeof statusLabels]}`}
          >
            {statusLabel === 'backlog' ? '📋 Backlog' : '👀 İnceleniyor'}
          </span>
        )}
        {regularLabels.map((label) => (
          <span
            key={label}
            className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400 whitespace-nowrap"
          >
            {label}
          </span>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20 cursor-grab active:cursor-grabbing group ${
        isDragging ? 'shadow-lg shadow-purple-500/20 z-50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {typeIcons[task.type]}
          <span className="text-sm font-medium text-gray-300 line-clamp-2">{task.title}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]} shrink-0`}>
          {task.priority}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.branch && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 overflow-x-auto">
          <BiGitBranch className="w-4 h-4 shrink-0" />
          <code className="bg-white/5 px-2 py-1 rounded whitespace-nowrap">{task.branch}</code>
        </div>
      )}

      {renderLabels()}

      {task.assignee && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs shrink-0">
              {task.assignee[0].toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 truncate">{task.assignee}</span>
          </div>
          {task.dueDate && (
            <time className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(task.dueDate).toLocaleDateString('tr-TR')}
            </time>
          )}
        </div>
      )}
    </motion.div>
  )
} 