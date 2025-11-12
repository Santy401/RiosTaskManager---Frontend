export interface CustomFilter {
    id: string
    name: string
    field: string
    value: string
    entity: 'company' | 'task' | 'user'
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CustomFilterFormData {
    name: string
    field: string
    value: string
    entity: 'company' | 'task' | 'user'
  }
  
  export interface CustomFilterFromAPI {
    id: string
    name: string
    field: string
    value: string
    entity: string
    createdAt: string
    updatedAt: string
  }
  