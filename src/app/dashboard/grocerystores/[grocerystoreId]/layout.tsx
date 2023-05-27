import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import {
  GroceryStoreItemType,
  GroceryStoreType,
  GroceryStoreWithItemsType,
} from "@/types";
import GroceryStoreHeader from "@/app/components/groceryStore/groceryStoreHeader";
import { getGroceryStoreData } from "@/app/utils/server/getData";

export const revalidate = 0;

export default async function GroceryStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    grocerystore_id: number;
  };
}) {
  const data = await getGroceryStoreData(params.grocerystore_id);

  return (
    <>
      {data && <GroceryStoreHeader {...data} />}
      {children}
    </>
  );
}
