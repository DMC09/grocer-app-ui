import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemType, Database, GroceryStoreItemType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { getAllGroceryStoresData } from "./groceryStore";

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

export async function addToCommonItemCatalog(
  supabase: SupabaseClient<Database>,
  groceryStoreItem: GroceryStoreItemType
) {
  const { data: commonItemResponse, error } = await supabase
    .from("commonitems")
    .insert({
      item_name: groceryStoreItem.name,
      item_notes: groceryStoreItem.notes,
      select_id: groceryStoreItem.select_id,
      image: groceryStoreItem.image,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    console.log(commonItemResponse, "Added new Common Item ");
    const CommonId = commonItemResponse?.id;

    const { data, error } = await supabase
      .from("grocerystoreitems")
      .update({
        cid: CommonId,
      })
      .eq("id", `${groceryStoreItem.id}`)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "updated items");
      await getAllGroceryStoresData(supabase);
      await getAllCommonItems(supabase);
    }
  }
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

export function isCommonItemDataStoreEmpty(
  commonItemsCatalog: CommonItemType[]
): boolean {
  if (commonItemsCatalog.length > 0) {
    for (const commonItem of commonItemsCatalog) {
      if (commonItem.item_name === "" || commonItem.select_id === "") {
        console.log("");
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}
