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
          created_at: string | null
          id: number
          image: string | null
          modified_at: string | null
          name: string | null
          notes: string | null
          quantity: number | null
          store_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          image?: string | null
          modified_at?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          store_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          image?: string | null
          modified_at?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          store_id?: number
        }
      }
      grocerystores: {
        Row: {
          created_at: string | null
          id: number
          image: string | null
          name: string
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image?: string | null
          name: string
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
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
