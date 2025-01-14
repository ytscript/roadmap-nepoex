import { Dialog } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { Task } from './TaskCard'
import { VscClose } from 'react-icons/vsc'
import { BiGitBranch } from 'react-icons/bi'
import DatePicker from './DatePicker'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  task?: Task
  type: 'create' | 'edit'
}

interface FormData {
  title: string
  description: string
  type: 'bug' | 'feature' | 'enhancement' | 'refactor' | 'docs' | 'pr'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  labels: string[]
  assignee?: string
  branch?: string
  dueDate?: string
}

const taskTypes = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'İyileştirme' },
  { value: 'refactor', label: 'Refactor' },
  { value: 'docs', label: 'Dokümantasyon' },
  { value: 'pr', label: 'Pull Request' }
]

const priorities = [
  { value: 'low', label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yüksek' },
  { value: 'urgent', label: 'Acil' }
]

export default function TaskModal({ isOpen, onClose, onSave, task, type }: TaskModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || 'feature',
    priority: task?.priority || 'medium',
    labels: task?.labels || [],
    assignee: task?.assignee || '',
    branch: task?.branch || '',
    dueDate: task?.dueDate || ''
  })

  const [labelInput, setLabelInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault()
      if (!formData.labels.includes(labelInput.trim())) {
        setFormData(prev => ({
          ...prev,
          labels: [...prev.labels, labelInput.trim()]
        }))
      }
      setLabelInput('')
    }
  }

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  // Form verilerini sıfırla
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        type: task?.type || 'feature',
        priority: task?.priority || 'medium',
        labels: task?.labels || [],
        assignee: task?.assignee || '',
        branch: task?.branch || '',
        dueDate: task?.dueDate || ''
      })
      setLabelInput('')
    }
  }, [isOpen, task])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#1a1a2e] rounded-xl p-6 max-w-2xl w-full border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {type === 'create' ? 'Yeni Görev Oluştur' : 'Görevi Düzenle'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <VscClose className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Görev Başlığı
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white placeholder-gray-500 hover:bg-white/10 transition-colors"
                placeholder="Örn: API Endpoint Geliştirmesi"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white placeholder-gray-500 hover:bg-white/10 transition-colors resize-none"
                placeholder="Görev detaylarını buraya yazın..."
              />
            </div>

            {/* Tip ve Öncelik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Görev Tipi
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-10 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                    required
                  >
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Öncelik
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-10 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                    required
                  >
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
              </div>
            </div>

            {/* Etiketler */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Etiketler
              </label>
              <div className="flex flex-wrap gap-2 p-2 bg-white/5 border border-purple-500/20 rounded-lg min-h-[2.5rem]">
                {formData.labels.map((label, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="hover:text-purple-300"
                    >
                      <VscClose className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={handleLabelKeyDown}
                  placeholder="Etiket eklemek için yazın ve Enter'a basın"
                  className="flex-1 min-w-[200px] bg-transparent border-none focus:outline-none text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Branch ve Atanan Kişi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Git Branch
                </label>
                <div className="relative">
                  <BiGitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white placeholder-gray-500 hover:bg-white/10 transition-colors"
                    placeholder="feature/user-registration"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Atanan Kişi
                </label>
                <input
                  type="text"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white placeholder-gray-500 hover:bg-white/10 transition-colors"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>
            </div>

            {/* Bitiş Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bitiş Tarihi
              </label>
              <DatePicker
                value={formData.dueDate || ''}
                onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
              />
            </div>

            {/* Butonlar */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all text-white font-medium"
              >
                {type === 'create' ? 'Oluştur' : 'Güncelle'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 