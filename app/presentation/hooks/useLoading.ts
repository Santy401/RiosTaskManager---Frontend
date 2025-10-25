import { create } from 'zustand'

interface LoadingState {
  deletingItems: Set<string>
  addDeleting: (id: string) => void
  removeDeleting: (id: string) => void
  isDeleting: (id: string) => boolean
}

export const useLoading = create<LoadingState>((set, get) => ({
  deletingItems: new Set<string>(),
  
  addDeleting: (id: string) => {
    set((state) => ({
      deletingItems: new Set([...state.deletingItems, id])
    }))
  },
  
  removeDeleting: (id: string) => {
    set((state) => {
      const newSet = new Set(state.deletingItems)
      newSet.delete(id)
      return { deletingItems: newSet }
    })
  },
  
  isDeleting: (id: string) => {
    return get().deletingItems.has(id)
  }
}))