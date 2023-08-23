
import groceryStore from "@/components/grocerystore/groceryStore";



import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  Database,
  GroceryStoreItemType,
  GroceryStoreType,
  GroceryStoreWithItemsType,
} from "@/types";
import { supabase } from "@supabase/auth-ui-shared";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export async function addNewGroceryStore(
  supabase: SupabaseClient<Database>,
  newGroceryStoreName: string,
  selectId: string,
  imagePath: string | null = null
) {
  if (imagePath) {
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([
        { name: newGroceryStoreName, select_id: selectId, image: imagePath },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      if (data) {
        return data;
      } else {
        return null;
      }
    }
  } else {
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([{ name: newGroceryStoreName, select_id: selectId }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      if (data) {
        return data;
      } else {
        return null;
      }
    }
  }
}

export async function updateGroceryStore(
  supabase: SupabaseClient<Database>,
  groceryStoreId: number,
  newGroceryStoreName: string,
  imagePath: string | null = null
) {
  if (imagePath) {
    const { data, error } = await supabase
      .from("grocerystores")
      .update({ name: newGroceryStoreName, image: imagePath })
      .eq("id", groceryStoreId)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    } else {

      return data;
    }
  } else {
    const { data, error } = await supabase
      .from("grocerystores")
      .update({ name: newGroceryStoreName })
      .eq("id", groceryStoreId)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    } else {

      return data;
    }
  }
}

export async function deleteGroceryStore(
  supabase: SupabaseClient<Database>,
  groceryStoreId: number,
  router: AppRouterInstance
) {
  const { data, error } = await supabase
    .from("grocerystores")
    .delete()
    .eq("id", groceryStoreId)
    .select()
    .single();

  if (data) {
    router.push("/dashboard");
    return data?.id;
  }
  if (error) {
    throw new Error(error.message);
  }
}

<<<<<<<< HEAD:src/helpers/groceryStore.ts
========
export async function addNewGroceryStoreItem(
  supabase: SupabaseClient<Database>,
  storeId: number,
  name: string,
  notes: string,
  quantity: number,
  selectId: string,
  imagePath: string | null = null
) {
  if (imagePath) {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert([
        {
          store_id: storeId,
          name,
          notes,
          quantity: Number(quantity),
          select_id: selectId,
          image: imagePath,
        },
      ])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "added new item with images and");
    }
  } else {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert([
        {
          store_id: storeId,
          name,
          notes,
          quantity: Number(quantity),
          select_id: selectId,
        },
      ])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "added new item without images and");
    }
  }
}


export async function getAllGroceryStoresData(
  supabase: SupabaseClient<Database>
) {
  // console.log(supabase,'supabase?')
  const { data, error } = await supabase
    .from("grocerystores")
    .select("*,grocerystoreitems(*)"); //filter this
  if (error) {
    throw new Error(error.message);
  } else {
    GroceryDataStore.setState({
      data: data as GroceryStoreWithItemsType[],
    });
  }
}

export function isGroceryStoreDataEmpty(
  groceryStoreData: GroceryStoreWithItemsType[] | undefined
): boolean {
  if (groceryStoreData) {
    for (const groceryStore of groceryStoreData) {
      if (
        groceryStore.created_at === "" ||
        groceryStore.id === 0 ||
        groceryStore.select_id === null
      ) {
        return true;
      }
    }

    return false;
  } else {
    return true;
  }
}
