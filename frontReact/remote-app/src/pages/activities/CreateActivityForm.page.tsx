import { useState } from 'react'
import { useCreateActivity } from './hooks/useCreateActivity.hook'
import type { ActivityType } from './types/activity.types'
import { TYPE_LABELS } from './utils/activityLabels.util'
import Error from '../../components/Erro';

function CreateActivityForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ActivityType>('STUDY')

  const { createActivity, isPending, error } = useCreateActivity()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createActivity({ title, description, type })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
        Criar Atividade
      </h1>

      {error && <Error message={error.message} />}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ex: Estudar React Hooks"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Descreva a atividade..."
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tipo
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {(Object.entries(TYPE_LABELS) as [ActivityType, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}

            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                Criando...
              </>
            ) : (
              'Criar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateActivityForm
