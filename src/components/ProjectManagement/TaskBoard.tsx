import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import TaskColumn from './TaskColumn'
import TaskCard, { Task } from './TaskCard'
import TaskModal from './TaskModal'
import { VscAdd, VscSearch, VscFilter, VscTag, VscClose } from 'react-icons/vsc'

interface Column {
  id: string
  title: string
}

const taskTypes = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'İyileştirme' },
  { value: 'refactor', label: 'Refactor' },
  { value: 'docs', label: 'Dokümantasyon' },
  { value: 'pr', label: 'Pull Request' }
] as const

const priorities = [
  { value: 'low', label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yüksek' },
  { value: 'urgent', label: 'Acil' }
] as const

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Yapılacak' },
  { id: 'in-progress', title: 'Geliştiriliyor' },
  { id: 'in-review', title: 'İnceleniyor' },
  { id: 'done', title: 'Tamamlandı' }
]

export default function TaskBoard() {
  const [columns] = useState<Column[]>(defaultColumns)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'API Endpoint Geliştirmesi',
      description: 'Yeni kullanıcı kayıt endpointinin geliştirilmesi',
      type: 'feature',
      priority: 'high',
      status: 'todo',
      assignee: 'Ahmet Yılmaz',
      labels: ['api', 'auth'],
      branch: 'feature/user-registration'
    },
    {
      id: '2',
      title: 'Memory Leak Düzeltmesi',
      description: 'Dashboard sayfasındaki memory leak sorununu çöz',
      type: 'bug',
      priority: 'urgent',
      status: 'in-progress',
      assignee: 'Mehmet Demir',
      labels: ['bug', 'performance'],
      branch: 'fix/dashboard-memory-leak'
    },
    {
      id: '3',
      title: 'Dokümantasyon Güncellemesi',
      description: 'API dokümantasyonunun güncellenmesi ve örneklerin eklenmesi',
      type: 'docs',
      priority: 'low',
      status: 'todo',
      assignee: 'Ayşe Kara',
      labels: ['docs', 'api', 'backlog'],
      branch: 'docs/api-update'
    },
    {
      id: '4',
      title: 'Performance Optimizasyonu',
      description: 'Ana sayfa yüklenme süresinin iyileştirilmesi',
      type: 'enhancement',
      priority: 'medium',
      status: 'in-review',
      assignee: 'Can Yıldız',
      labels: ['performance', 'frontend'],
      branch: 'enhancement/homepage-performance'
    }
  ])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedPriority, setSelectedPriority] = useState<string>('')
  const [selectedAssignee, setSelectedAssignee] = useState<string>('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px hareket etmeden sürükleme başlamaz
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Otomatik scroll için yardımcı fonksiyon
  const handleScroll = (element: HTMLElement | null, speed: number) => {
    if (!element) return
    const scrollLeft = element.scrollLeft + speed
    element.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    if (active.id !== over.id) {
      const activeTaskIndex = tasks.findIndex((t) => t.id === active.id)
      const activeTask = tasks[activeTaskIndex]

      // Eğer kolon üzerine bırakıldıysa
      if (over.data?.current?.type === 'column') {
        setTasks((tasks) => {
          const updatedTasks = [...tasks]
          updatedTasks[activeTaskIndex] = {
            ...activeTask,
            status: over.id as string
          }
          return updatedTasks
        })
      } else {
        // Eğer başka bir görev üzerine bırakıldıysa
        const overTaskIndex = tasks.findIndex((t) => t.id === over.id)
        const overTask = tasks[overTaskIndex]

        setTasks((tasks) => {
          const updatedTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex)
          // Aynı zamanda durumu da güncelle
          updatedTasks[overTaskIndex] = {
            ...activeTask,
            status: overTask.status
          }
          return updatedTasks
        })
      }
    }

    setActiveTask(null)
  }

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTaskIndex = tasks.findIndex((t) => t.id === active.id)
    const activeTask = tasks[activeTaskIndex]

    // Scroll container'ı bul
    const container = document.querySelector('.scroll-container')
    if (container instanceof HTMLElement) {
      const containerRect = container.getBoundingClientRect()
      const mouseX = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientX : 0
      
      // Sağ ve sol kenarlarda otomatik scroll
      const scrollTriggerArea = 100 // px
      if (mouseX > containerRect.right - scrollTriggerArea) {
        handleScroll(container, 10)
      } else if (mouseX < containerRect.left + scrollTriggerArea) {
        handleScroll(container, -10)
      }
    }

    // Eğer kolon üzerine sürükleniyorsa
    if (over.data?.current?.type === 'column' && activeTask.status !== over.id) {
      setTasks((tasks) => {
        const updatedTasks = [...tasks]
        updatedTasks[activeTaskIndex] = {
          ...activeTask,
          status: over.id as string
        }
        return updatedTasks
      })
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
  }

  const getColumnTasks = (columnId: string) => {
    return filteredTasks.filter((task) => task.status === columnId)
  }

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      type: taskData.type || 'feature',
      priority: taskData.priority || 'medium',
      status: 'todo',
      labels: taskData.labels || [],
      assignee: taskData.assignee,
      branch: taskData.branch,
      dueDate: taskData.dueDate
    }

    setTasks(prev => [...prev, newTask])
  }

  const handleEditTask = (taskData: Partial<Task>) => {
    if (!editingTask) return

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    ))
    setEditingTask(null)
  }

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  // Benzersiz etiketleri, atanan kişileri ve diğer filtreleme seçeneklerini hesapla
  const uniqueLabels = useMemo(() => {
    const labels = new Set<string>()
    tasks.forEach(task => task.labels.forEach(label => labels.add(label)))
    return Array.from(labels)
  }, [tasks])

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>()
    tasks.forEach(task => task.assignee && assignees.add(task.assignee))
    return Array.from(assignees)
  }, [tasks])

  // Filtrelenmiş görevleri hesapla
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Arama sorgusu kontrolü
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Tip kontrolü
      const matchesType = selectedType === '' || task.type === selectedType

      // Öncelik kontrolü
      const matchesPriority = selectedPriority === '' || task.priority === selectedPriority

      // Atanan kişi kontrolü
      const matchesAssignee = selectedAssignee === '' || task.assignee === selectedAssignee

      // Etiket kontrolü
      const matchesLabels = selectedLabels.length === 0 || 
        selectedLabels.every(label => task.labels.includes(label))

      return matchesSearch && matchesType && matchesPriority && matchesAssignee && matchesLabels
    })
  }, [tasks, searchQuery, selectedType, selectedPriority, selectedAssignee, selectedLabels])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 h-screen overflow-hidden">
        <div className="p-4 md:p-8 h-full flex flex-col">
          {/* Başlık ve Kontroller */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Proje Yönetimi
            </h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              <VscAdd className="w-5 h-5" />
              <span>Yeni Görev</span>
            </button>
          </div>

          {/* Arama ve Filtreleme */}
          <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-xl p-4 mb-8 border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Arama */}
              <div className="relative">
                <VscSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Görev ara..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white placeholder-gray-500 hover:bg-white/10 transition-colors"
                />
              </div>

              {/* Tip Filtresi */}
              <div className="relative">
                <VscFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a2e] text-white">Tüm Tipler</option>
                  {taskTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-[#1a1a2e] text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                  </svg>
                </div>
              </div>

              {/* Öncelik Filtresi */}
              <div className="relative">
                <VscFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a2e] text-white">Tüm Öncelikler</option>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value} className="bg-[#1a1a2e] text-white">
                      {priority.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                  </svg>
                </div>
              </div>

              {/* Atanan Kişi Filtresi */}
              <div className="relative">
                <VscFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a2e] text-white">Tüm Kişiler</option>
                  {uniqueAssignees.map(assignee => (
                    <option key={assignee} value={assignee} className="bg-[#1a1a2e] text-white">
                      {assignee}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Etiket Filtreleri */}
            <div className="flex flex-wrap gap-2">
              {uniqueLabels.map(label => (
                <button
                  key={label}
                  onClick={() => setSelectedLabels(prev => 
                    prev.includes(label) 
                      ? prev.filter(l => l !== label)
                      : [...prev, label]
                  )}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedLabels.includes(label)
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:bg-purple-500/10'
                  }`}
                >
                  <VscTag className="w-4 h-4" />
                  {label}
                </button>
              ))}
              {selectedLabels.length > 0 && (
                <button
                  onClick={() => setSelectedLabels([])}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                >
                  <VscClose className="w-4 h-4" />
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>

          {/* Görev Panosu - Scroll Container */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-x-auto overflow-y-hidden scroll-container scroll-smooth">
              <div className="flex flex-col lg:flex-row gap-8 h-full lg:h-[calc(100vh-20rem)] min-w-fit">
                {columns.map((column) => (
                  <TaskColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={getColumnTasks(column.id)}
                    onEditTask={handleOpenEditModal}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        scale: 1.05
      }}>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        task={editingTask || undefined}
        type={editingTask ? 'edit' : 'create'}
      />
    </DndContext>
  )
} 