import groceryStore from "@/app/components/groceryStore/groceryStore";
import { Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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

export async function addNewGroceryStore(
  supabase: SupabaseClient<Database>,
  newGroceryStoreName: string,
  selectId: string,
  imagePath: string| null = null
) {

  console.log(supabase,newGroceryStoreName,selectId,imagePath)
  if (imagePath) {
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([{ name: newGroceryStoreName, select_id:selectId, image: imagePath }]);

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "Grocery Store added");
    }
  } else {
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([{ name: newGroceryStoreName, select_id:selectId }]);

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "Grocery Store added");
    }
  }
}
