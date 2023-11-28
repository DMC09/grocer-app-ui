import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { DashboardView, Database, ProfileType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfileData(
  supabase: SupabaseClient<Database>,
  userId?: string
) {
  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    throw new Error(error.message);
  } else {
    ProfileDataStore.setState({ data: profileData as ProfileType });
    return profileData;
  }
}
export async function editProfileData(
  supabase: SupabaseClient<Database>,
  firstName: string,
  lastName: string,
  timeStamp: string,
  imagePath: string | null,
  phone: string | null,
  profileId: string
) {
  if (imagePath) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: timeStamp,
        avatar_url: imagePath,
        phone,
      })
      .eq("id", profileId)
      .select();

    if (data) {
      return data;
    } else if (error) {
      throw new Error(error.message);
    }
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: timeStamp,
        phone,
      })
      .eq("id", profileId)
      .select();

    if (data) {
      return data;
    } else if (error) {
      throw new Error(error.message);
    }
  }
}

// export async function handleChangeGroceryStoreItemView(
//   supabase: SupabaseClient<Database>,
//   expanded: boolean,
//   profileId: string
// ) {
//   const { data, error } = await supabase
//     .from("profiles")
//     .update({ expanded_groceryitem: !expanded })
//     .eq("id", profileId)
//     .select()
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   } else {
//     console.log(data, "after changing view");
//   }
// }

export async function updateDashboardView(
  supabase: SupabaseClient<Database>,
  profileId: string,
  view: DashboardView
) {
  switch (view) {
    case DashboardView.AllItemsView:
      console.log("updating To All View!");
      const { data: AllViewData, error: AllViewError } = await supabase
        .from("profiles")
        .update({ view_by_category: false, view_all: true })
        .eq("id", profileId)
        .select()
        .single();

      if (AllViewError) {
        console.error("Invalid DashboardView value:", view);
      } else {
        ProfileDataStore.setState({
          dashboardView: DashboardView.AllItemsView as DashboardView,
        });
      }
      break;
    case DashboardView.CategoryView:
      const { data: categoryData, error: categoryError } = await supabase
        .from("profiles")
        .update({ view_by_category: true, view_all: false })
        .eq("id", profileId)
        .select()
        .single();

      if (categoryError) {
        console.error("Invalid DashboardView value:", view);
      } else {
        ProfileDataStore.setState({
          dashboardView: DashboardView.CategoryView as DashboardView,
        });
      }
      break;
    case DashboardView.StoreView:
      const { data: storeData, error: storeError } = await supabase
        .from("profiles")
        .update({ view_by_category: false, view_all: false })
        .eq("id", profileId)
        .select()
        .single();

      if (storeError) {
        console.error("Invalid DashboardView value:", view);
      } else {
        ProfileDataStore.setState({
          dashboardView: DashboardView.StoreView as DashboardView,
        });
      }
      break;
    default:
      console.error("Invalid DashboardView value:", view);
      break;
  }
}
