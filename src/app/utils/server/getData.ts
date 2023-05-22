import { GroceryStoreType } from "@/types";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import { useSupabase } from "../../components/supabase/supabase-provider";

export async function getGroceryStoreData(id: number) {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  try {
    const { data, error }: { data: GroceryStoreType | null; error: any } =
      await supabase.from("grocerystores").select("*").eq("id", id).single();
    // const { data, error }: { data: any | null; error: any } = await supabase
    //   .from("grocerystores")
    //   .select("*,grocerystoreitems(*)")
    //   .eq("id", params.grocerystoreId)
    //   .single();

    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}
