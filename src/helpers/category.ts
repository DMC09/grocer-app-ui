import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";
import { CategoryType, CommonItemType, Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchAllCategories(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("categories").select("*");
  console.log("fetching categories");
  if (error) {
    throw new Error(error.message);
  } else {
    CategoryDataStore.setState({
      categories: data as CategoryType[],
    });
  }
}

export async function addCategory(
  supabase: SupabaseClient<Database>,
  name: string,
  selectId: string
) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      select_id: selectId,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error?.message);
  } else {
    console.log(data, "Added new Category");
    return data;
  }
}

export async function deleteCategory(
  supabase: SupabaseClient<Database>,
  id: number
) {
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    console.log(data, "data after a category ");
  }
}

export async function updateCategory(
  supabase: SupabaseClient<Database>,
  id: number,
  updatedName: string,
  selectId: string
) {
  console.log(updatedName, "name to udpate");
  const { data, error } = await supabase
    .from("categories")
    .update({ name: updatedName })
    .eq("id", id)
    .eq("select_id", selectId)
    .select()
    .single();

  if (error) {
    throw new Error(error?.message);
  } else {
    console.log(data, "data from patch");
    return data;
  }
}
