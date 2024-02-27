import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemType, Database, GroceryStoreItemType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { fetchAllItems, getAllGroceryStoresData } from "./groceryStore";

export async function addFromCommonItems(supabase: SupabaseClient<Database>) {
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
    const CommonId = commonItemResponse?.id;

    const { data, error } = await supabase
      .from("grocerystoreitems")
      .update({
        common_item_id: CommonId,
      })
      .eq("id", `${groceryStoreItem.id}`)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "updated items");
      await getAllGroceryStoresData(supabase);
      await fetchAllCommonItems(supabase);
      await fetchAllItems(supabase);
    }
  }
}

export async function fetchAllCommonItems(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("commonitems").select("*");
  console.log("fetching common itemS1");
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

export async function updateCommonItem(
  supabase: SupabaseClient<Database>,
  id: number,
  name: string,
  notes: string | null,
  imagePath: string | null
) {
  if (imagePath) {
    console.log(imagePath, "image path");
    const { data, error } = await supabase
      .from("commonitems")
      .update({
        item_name: name,
        item_notes: notes,
        image: imagePath,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error?.message);
    } else {
      console.log(data, "Updated Common Item but with new image");
      return data;
    }
  } else {
    const { data, error } = await supabase
      .from("commonitems")
      .update({
        item_name: name,
        item_notes: notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error?.message);
    } else {
      console.log(data, "Updated Common Item but with no new image");
      return data;
    }
  }
}

export async function addCommonItem(
  supabase: SupabaseClient<Database>,
  name: string,
  notes: string,
  selectId: string,
  image: string | null
) {
  if (image) {
    const { data, error } = await supabase
      .from("commonitems")
      .insert({
        item_name: name,
        item_notes: notes,
        select_id: selectId,
        image,
      })
      .select()
      .single();
    if (error) {
      throw new Error(error?.message);
    } else {
      console.log(data, "Inserted new common item with picture");
      return data;
    }
  } else {
    const { data, error } = await supabase
      .from("commonitems")
      .insert({
        item_name: name,
        item_notes: notes,
        select_id: selectId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "Inserted new common item with no  picture");
      return data;
    }
  }
}

export async function deleteCommonItem(
  supabase: SupabaseClient<Database>,
  id: number
) {
  const { data, error } = await supabase
    .from("commonitems")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    console.log(data, "data after deleting a common item ");
    return data;
  }
}
