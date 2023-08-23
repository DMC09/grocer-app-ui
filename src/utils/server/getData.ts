import { GroceryStoreType } from "@/types";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

import { PostgrestError } from "@supabase/supabase-js";

export async function getGroceryStoreData(id: number) {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  try {
    const {
      data,
      error,
    }: { data: GroceryStoreType | null; error: PostgrestError | null } =
      await supabase.from("grocerystores").select("*").eq("id", id).single();
    if (data) {
      return data;
    } else {
      console.log(error?.message);
      return null;
    }
  } catch (error) {
    return null;
  }
}
