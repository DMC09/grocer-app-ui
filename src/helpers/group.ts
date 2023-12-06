import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { Database, GroupMemberType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getGroupData(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("group_members_view").select("*");

  if (error) {
    throw new Error(error.message);
  } else {
    ProfileDataStore.setState({ groupData: data as GroupMemberType[] });
  }
}
