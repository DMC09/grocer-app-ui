export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          image: string | null
          name: string
          quantity: number | null
          select_id: string | null
        }
        Insert: {
          id?: number
          image?: string | null
          name: string
          quantity?: number | null
          select_id?: string | null
        }
        Update: {
          id?: number
          image?: string | null
          name?: string
          quantity?: number | null
          select_id?: string | null
        }
        Relationships: []
      }
      commonitems: {
        Row: {
          category: string | null
          id: number
          image: string | null
          item_name: string | null
          item_notes: string | null
          select_id: string | null
        }
        Insert: {
          category?: string | null
          id?: number
          image?: string | null
          item_name?: string | null
          item_notes?: string | null
          select_id?: string | null
        }
        Update: {
          category?: string | null
          id?: number
          image?: string | null
          item_name?: string | null
          item_notes?: string | null
          select_id?: string | null
        }
        Relationships: []
      }
      grocerystoreitems: {
        Row: {
          category: string | null
          category_id: number | null
          common_item_id: number | null
          created_at: string | null
          id: number
          image: string | null
          modified_at: string | null
          name: string | null
          notes: string | null
          quantity: number | null
          select_id: string | null
          store_id: number | null
        }
        Insert: {
          category?: string | null
          category_id?: number | null
          common_item_id?: number | null
          created_at?: string | null
          id?: number
          image?: string | null
          modified_at?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          select_id?: string | null
          store_id?: number | null
        }
        Update: {
          category?: string | null
          category_id?: number | null
          common_item_id?: number | null
          created_at?: string | null
          id?: number
          image?: string | null
          modified_at?: string | null
          name?: string | null
          notes?: string | null
          quantity?: number | null
          select_id?: string | null
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grocerystoreitems_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocerystoreitems_common_item_id_fkey"
            columns: ["common_item_id"]
            isOneToOne: false
            referencedRelation: "commonitems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocerystoreitems_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "grocerystores"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      groups: {
        Row: {
          confirmation_accepted: boolean | null
          created_at: string | null
          email: string | null
          first_name: string | null
          group_id: string | null
          group_image: string | null
          group_name: string | null
          id: number
          is_admin: boolean | null
          last_name: string | null
          modified_at: string | null
          profile_id: string | null
          profile_image: string | null
          share_code: string | null
        }
        Insert: {
          confirmation_accepted?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          group_id?: string | null
          group_image?: string | null
          group_name?: string | null
          id?: number
          is_admin?: boolean | null
          last_name?: string | null
          modified_at?: string | null
          profile_id?: string | null
          profile_image?: string | null
          share_code?: string | null
        }
        Update: {
          confirmation_accepted?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          group_id?: string | null
          group_image?: string | null
          group_name?: string | null
          id?: number
          is_admin?: boolean | null
          last_name?: string | null
          modified_at?: string | null
          profile_id?: string | null
          profile_image?: string | null
          share_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          in_group: boolean | null
          last_name: string | null
          phone: string | null
          select_id: string | null
          updated_at: string
          view_all: boolean
          view_by_category: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          in_group?: boolean | null
          last_name?: string | null
          phone?: string | null
          select_id?: string | null
          updated_at?: string
          view_all?: boolean
          view_by_category?: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          in_group?: boolean | null
          last_name?: string | null
          phone?: string | null
          select_id?: string | null
          updated_at?: string
          view_all?: boolean
          view_by_category?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      group_members_view: {
        Row: {
          avatar_url: string | null
          email: string | null
          first_name: string | null
          group_id: string | null
          group_image: string | null
          group_name: string | null
          id: number | null
          last_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_groups_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      join_group_via_share_code: {
        Args: {
          share_code: string
          email: string
          first_name: string
          last_name: string
          profile_id: string
          profile_image: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
