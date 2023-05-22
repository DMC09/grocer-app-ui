import { useSupabase } from "@/app/components/supabase/supabase-provider";
import { GroceryStoreItemType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getGroceryStoreItems(
  supabase: SupabaseClient,
  id: number
) {
    const {data} = await supabase
    .from("grocerystoreitems")
    .select("*")
    .eq("storeId", id);
  if (data) {
    return data;
  }else {
    return null
  }


//   try {
//     // const { supabase } = useSupabase();

    
//   } catch (error: any) {
//     console.log(error.message);
//     return null;
//   }
}
