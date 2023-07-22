
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import {  CommonItemType, Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function addFromCommonItems(supabase: SupabaseClient<Database>) {
  // When I do a check on the individal commonGroceryStoreItem
  // store id needs to be the same
  // could make a state for the common items
  // Then part of that state can be the items to add?
  // Quantity will differ,
  // name,notes,select_id, and image should come from the object
  //but we want image path to be changeable.

  const commonItemsToAdd = null;

  // const { data, error } = await supabase
    // .from("grocerystoreitems")
    // .insert([
    //   {
    //     store_id: storeId,
    //     name,
    //     notes,
    //     quantity: Number(quantity),
    //     select_id: selectId,
    //     image: imagePath,
    //   },
    // ])
    // .select();
}

export async function addToCommonItems(supabase: SupabaseClient<Database>,) {

    // const {data, error} = await supabase.from("commonitems").insert({
    //     item_name:item_name,
    //     item_notes:item_notes,
    //     select_id: selectId,
    //     image: imagePath,
    //     category:category


    // })
}

export async function getAllCommonItems(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("commonitems").select("*");

  if (error) {
    throw new Error(error.message);
  } else {
    CommonItemsDataStore.setState({
      catalog: data as CommonItemType[],
    });
  }
}
