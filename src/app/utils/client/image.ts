import { Database } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function generateGroceryStoreImagePath(select_id: string) {
  //Formula is last 16 characters of select_id + Current DateTime in seconds/
  const lastPartOfSelectId = select_id?.slice(-16);
  const currentTimeStamp = new Date().getTime();
  return `grocerystore_images/${lastPartOfSelectId}/${currentTimeStamp}`;
}
export async function generateGroceryStoreItemImagePath(select_id: string) {
  //Formula is last 16 characters of select_id + Current DateTime in seconds/
  const lastPartOfSelectId = select_id?.slice(-16);
  const currentTimeStamp = new Date().getTime();
  return `grocerystoreitem_images/${lastPartOfSelectId}/${currentTimeStamp}`;
}

export async function handleGroceryStoreImageUpload(
  supabase: SupabaseClient<Database>,
  imagePath: string,
  imageRaw: string
) {
  const { data, error } = await supabase?.storage
    .from("grocerystore")
    // Need a custom path thing for this.
    // Also need to getthe public url
    .upload(imagePath, imageRaw);
  if (error) {
    throw new Error(`Error uploading image ${error.message}`);
  } else {
    console.log(data, "image uploaded successfully");
  }
}

