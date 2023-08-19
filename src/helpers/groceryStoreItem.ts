import { Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function updateGroceryStoreItem(
  supabase: SupabaseClient<Database>,
  itemId: number,
  name: string,
  notes: string | null = null,
  quantity: number = 1,
  modified_at: string,
  imagePath: string | null = null
) {
  if (imagePath) {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .update({
        name,
        notes,
        quantity: Number(quantity),
        modified_at,
        image: imagePath,
      })
      .eq("id", itemId)
      .select()
      .single();
    if (error) {
      throw new Error(error?.message);
    } else {
      console.log(data, "Updated Item but with new image");
      return data;
    }
  } else {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .update({
        name,
        notes,
        quantity: Number(quantity),
        modified_at,
      })
      .eq("id", itemId)
      .select()
      .single();
    if (error) {
      throw new Error(error?.message);
    } else {
      console.log(data, "Updated Item but with no new image");
      return data;
    }
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
      return data;
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
      return data;
    }
  }
}
