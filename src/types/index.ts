import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      commonitems: {
        Row: {
          category: string | null;
          id: number;
          image: string | null;
          item_name: string | null;
          item_notes: string | null;
          select_id: string | null;
        };
        Insert: {
          category?: string | null;
          id?: number;
          image?: string | null;
          item_name?: string | null;
          item_notes?: string | null;
          select_id?: string | null;
        };
        Update: {
          category?: string | null;
          id?: number;
          image?: string | null;
          item_name?: string | null;
          item_notes?: string | null;
          select_id?: string | null;
        };
        Relationships: [];
      };
      grocerystoreitems: {
        Row: {
          cid: number | null;
          created_at: string | null;
          id: number;
          image: string | null;
          modified_at: string | null;
          name: string ;
          notes: string | null;
          quantity: number ;
          select_id: string | null;
          store_id: number;
        };
        Insert: {
          cid?: number | null;
          created_at?: string | null;
          id?: number;
          image?: string | null;
          modified_at?: string | null;
          name?: string;
          notes?: string | null;
          quantity?: number ;
          select_id?: string | null;
          store_id: number;
        };
        Update: {
          cid?: number | null;
          created_at?: string | null;
          id?: number;
          image?: string | null;
          modified_at?: string | null;
          name?: string ;
          notes?: string | null;
          quantity?: number ;
          select_id?: string | null;
          store_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "grocerystoreitems_cid_fkey";
            columns: ["cid"];
            referencedRelation: "commonitems";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "grocerystoreitems_store_id_fkey";
            columns: ["store_id"];
            referencedRelation: "grocerystores";
            referencedColumns: ["id"];
          }
        ];
      };
      grocerystores: {
        Row: {
          created_at: string | null;
          id: number;
          image: string | null;
          name: string;
          quantity: number ;
          select_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image?: string | null;
          name: string;
          quantity?: number ;
          select_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image?: string | null;
          name?: string;
          quantity?: number ;
          select_id?: string | null;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          confirmation_accepted: boolean | null;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          group_id: string | null;
          group_image: string | null;
          group_name: string | null;
          id: number;
          is_admin: boolean | null;
          last_name: string | null;
          modified_at: string | null;
          profile_id: string | null;
          profile_image: string | null;
          share_code: string | null;
        };
        Insert: {
          confirmation_accepted?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          group_id?: string | null;
          group_image?: string | null;
          group_name?: string | null;
          id?: number;
          is_admin?: boolean | null;
          last_name?: string | null;
          modified_at?: string | null;
          profile_id?: string | null;
          profile_image?: string | null;
          share_code?: string | null;
        };
        Update: {
          confirmation_accepted?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          group_id?: string | null;
          group_image?: string | null;
          group_name?: string | null;
          id?: number;
          is_admin?: boolean | null;
          last_name?: string | null;
          modified_at?: string | null;
          profile_id?: string | null;
          profile_image?: string | null;
          share_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "groups_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          expanded_dashboard: boolean;
          expanded_groceryitem: boolean;
          first_name: string | null;
          id: string;
          in_group: boolean | null;
          last_name: string | null;
          phone: string | null;
          select_id: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          expanded_dashboard?: boolean;
          expanded_groceryitem?: boolean;
          first_name?: string | null;
          id: string;
          in_group?: boolean | null;
          last_name?: string | null;
          phone?: string | null;
          select_id?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          expanded_dashboard?: boolean;
          expanded_groceryitem?: boolean;
          first_name?: string | null;
          id?: string;
          in_group?: boolean | null;
          last_name?: string | null;
          phone?: string | null;
          select_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      group_members_view: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          first_name: string | null;
          group_id: string | null;
          group_image: string | null;
          group_name: string | null;
          id: number | null;
          last_name: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_groups_for_authenticated_user: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      join_group_via_share_code: {
        Args: {
          share_code: string;
          email: string;
          first_name: string;
          last_name: string;
          profile_id: string;
          profile_image: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type GroceryStoreType =
  Database["public"]["Tables"]["grocerystores"]["Row"];
export type GroceryStoreItemType =
  Database["public"]["Tables"]["grocerystoreitems"]["Row"];
export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
export type GroupType = Database["public"]["Tables"]["groups"]["Row"];
export type GroupMemberType =
  Database["public"]["Views"]["group_members_view"]["Row"];
export type CommonItemType = Database["public"]["Tables"]["commonitems"]["Row"];

export type CommonItemToAdd = {
  index: number;
  id: number;
  name: string;
  notes: string;
  quantity: number;
  image: string;
};

export type GroceryStoreProps = {
  groceryStore: GroceryStoreType;
  expanded?: boolean | null;
};
export type GroceryStoreItemProps = {
  groceryStoreItem: GroceryStoreItemType;
};

export interface GroceryStoreWithItemsType extends GroceryStoreType {
  grocerystoreitems: GroceryStoreItemType[];
}

export interface ExpandedGroceryStoreProps {
  groceryStore: GroceryStoreType;
  router: AppRouterInstance;
}

export interface MinimalGroceryStoreProps {
  groceryStore: GroceryStoreType;
  router: AppRouterInstance;
}
