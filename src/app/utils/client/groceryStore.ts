import groceryStore from "@/app/components/groceryStore/groceryStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
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
      console.log(data, "Grocery Store added");
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
      console.log(data, "Grocery Store added");
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
      console.log(data, "updated settings");
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
      console.log(data, "updated settings");
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
    .select();

  if (data && data.length > 0) {
    router.push("/dashboard");
  }
  if (error) {
    throw new Error(error.message);
  }
}

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

export async function getAllGroceryStoresalt(
  supabase: SupabaseClient<Database>
) {
  // console.log(supabase,'supabase?')
  const { data, error } = await supabase
    .from("grocerystores")
    .select("*,grocerystoreitems(*)"); //filter this
  if (error) {
    throw new Error(error.message);
  } else {
    useGroceryStoreStore.setState({
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
