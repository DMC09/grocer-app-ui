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
          select_id: string | null
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
          select_id?: string | null
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
          select_id?: string | null
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
          select_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image?: string | null
          name: string
          quantity?: number | null
          select_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string
          quantity?: number | null
          select_id?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          select_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          select_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          select_id?: string | null
          updated_at?: string
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


export type GroceryStoreType = Database['public']['Tables']['grocerystores']['Row']  
export type GroceryStoreItemType = Database['public']['Tables']['grocerystoreitems']['Row']

export interface GroceryStoreWithItemsType extends GroceryStoreType {
  grocerystoreitems: GroceryStoreItemType[];
}