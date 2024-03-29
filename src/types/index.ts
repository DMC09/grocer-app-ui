import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"




export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          category_id: number | null
          id: number
          image: string | null
          item_name: string | null
          item_notes: string | null
          select_id: string | null
        }
        Insert: {
          category_id?: number | null
          id?: number
          image?: string | null
          item_name?: string | null
          item_notes?: string | null
          select_id?: string | null
        }
        Update: {
          category_id?: number | null
          id?: number
          image?: string | null
          item_name?: string | null
          item_notes?: string | null
          select_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_commonitems_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      grocerystoreitems: {
        Row: {
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
          },
          {
            foreignKeyName: "public_grocerystoreitems_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never



export type GroceryStoreType =
  Database["public"]["Tables"]["grocerystores"]["Row"];
export type GroceryStoreItemType =
  Database["public"]["Tables"]["grocerystoreitems"]["Row"];
export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
export type GroupType = Database["public"]["Tables"]["groups"]["Row"];
export type GroupMemberType =
  Database["public"]["Views"]["group_members_view"]["Row"];
export type CommonItemType = Database["public"]["Tables"]["commonitems"]["Row"];
export type CategoryType = Database["public"]["Tables"]["categories"]["Row"]; 

export type CommonItemToAdd = {
  uniqueItemId: number;
  id: number;
  name: string;
  notes: string;
  quantity: number;
  image: string;
  categoryId: number | null;
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

export enum ImageType {
  Item = "item",
  Store = "store",
  Profile = "profile",
  Group = "group",
}
export enum BucketType {
  Store = "grocerystore",
  Profile = "profile",
}
export enum AlertType {
  Success = "success",
  Fail = "Failure",
}

export enum AlertMsgType {
  AddNewStoreSuccess = "Store added",
  AddNewStoreFail = "Unable to add store.. ",
  AddNewItemSuccess = "Item added",
  AddNewCategorySuccess = "Category added",
  AddNewItemFail = "Unable to add item",
  AddNewCategoryFail = "Unable to add Category"
}

export type SnackBarPropsType = {
  msg: AlertMsgType | null;
  type: AlertType | null;
  color: string | null;
};

export enum DashboardView {
  StoreView = "Store",
  AllItemsView = "All",
  CategoryView = "Category",

}