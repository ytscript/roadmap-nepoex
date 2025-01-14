import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from './TaskCard'
import TaskCard from './TaskCard'
import { VscAdd } from 'react-icons/vsc'

interface TaskColumnProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
}

export default function TaskColumn({ id, title, tasks, onAddTask, onEditTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      accepts: ['task']
    }
  })

  return (
    <div className="flex flex-col h-full w-full lg:w-[calc(25%-1.5rem)] shrink-0 touch-none">
      {/* Kolon Başlığı */}
      <div className="flex items-center justify-between mb-4 px-2 select-none">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-300">{title}</h3>
          <div className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400">
            {tasks.length}
          </div>
        </div>
        <button
          onClick={onAddTask}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <VscAdd className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Görevler Listesi */}
      <div
        ref={setNodeRef}
        className={`flex-1 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-xl p-4 overflow-y-auto space-y-4 border transition-colors touch-pan-y ${
          isOver
            ? 'border-purple-500/50 bg-purple-500/10'
            : 'border-purple-500/10'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 select-none">
            Buraya görev sürükleyin
          </div>
        )}
      </div>
    </div>
  )
} 