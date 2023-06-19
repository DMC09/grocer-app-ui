import { Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfileData(supabase: SupabaseClient<Database>,userId?:string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      return data
    }
  }

  export async function handleChangeView(
    supabase: SupabaseClient<Database>,
    expanded: boolean,
    profileId: string
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ expanded_groceryitem: !expanded })
      .eq("id", profileId)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  }