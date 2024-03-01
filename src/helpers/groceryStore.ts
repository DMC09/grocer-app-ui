import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { ItemDataStore } from "@/stores/ItemStore";
import {
  Database,
  GroceryStoreItemType,
  GroceryStoreType,
  GroceryStoreWithItemsType,
} from "@/types";
import { supabase } from "@supabase/auth-ui-shared";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


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
      console.log(data, "added new item with images ");
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

  const { data, error } = await supabase
    .from("grocerystores")
    .select("*,grocerystoreitems(*)"); //TODO: filter this using select_id
  if (error) {
    throw new Error(error.message);
  } else {
    GroceryDataStore.setState({
      data: data as GroceryStoreWithItemsType[],
    });
  }
}

export async function fetchAllGroceryStores(supabase: SupabaseClient<Database>) {

  const { data, error } = await supabase.from("grocerystores").select("*"); //TODO: filter this using select_id
  if (error) {
    throw new Error(error.message);
  } else {
    GroceryDataStore.setState({
      groceryStores: data as GroceryStoreType[],
    });
  }
}

export async function fetchAllItems(supabase: SupabaseClient<Database>) {

  const { data, error } = await supabase.from("grocerystoreitems").select("*"); //filter this
  if (error) {
    throw new Error(error.message);
  } else {
    ItemDataStore.setState({
      data: data as GroceryStoreItemType[],
    });
  }
}

export function isItemsStateEmpty(
  items: GroceryStoreItemType[] | undefined
): boolean {
  if (items) {
    for (const item of items) {
      if (
        item.created_at === "" ||
        item.id === 0 ||
        item.select_id === null
      ) {
        return true;
      }
    }

    return false;
  } else {
    return true;
  }
}
