import { BucketType, Database, ImageType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function generateImagePath(select_id: string, type: ImageType) {
  const partialId = select_id?.slice(-16);
  const timeStamp = new Date().getTime();

  if (Object.values(ImageType).includes(type)) {
    return `${type}/${partialId}/${timeStamp}`;
  } else {
    throw new Error(`Unknown image type ${type}`);
  }
}

export async function handleImageUpload(
  supabase: SupabaseClient<Database>,
  imagePath: string,
  imageRaw: string,
  bucketType: BucketType
) {
  const { data, error } = await supabase?.storage
    .from(bucketType)
    .upload(imagePath, imageRaw);

  if (error) {
    throw new Error(
      `Error uploading image to the ${bucketType} bucket ${error.message}`
    );
  } else {
    console.log(data, "image uploaded successfully");
  }
}
