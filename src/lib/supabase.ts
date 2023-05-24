export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      grocerystoreitems: {
        Row: {
          createdAt: string | null
          id: number
          image: string | null
          modifiedAt: string | null
          name: string | null
          notes: string | null
          quantity: number | null
          storeId: number
        }
        Insert: {
          createdAt?: string | null
          id?: number
          image?: string | null
          modifiedAt?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          storeId: number
        }
        Update: {
          createdAt?: string | null
          id?: number
          image?: string | null
          modifiedAt?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          storeId?: number
        }
      }
      grocerystores: {
        Row: {
          createdAt: string | null
          id: number
          image: string | null
          name: string
          quantity: number | null
        }
        Insert: {
          createdAt?: string | null
          id?: number
          image?: string | null
          name: string
          quantity?: number | null
        }
        Update: {
          createdAt?: string | null
          id?: number
          image?: string | null
          name?: string
          quantity?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
