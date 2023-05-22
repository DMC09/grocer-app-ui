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
    grocerystoreId: number;
  };
}) {
  const data = await getGroceryStoreData(params.grocerystoreId);


  return (
    // get the actual data from here and pass it in the component here.
    // pass in the id name image quanitty, a
    <>
      {data && <GroceryStoreHeader {...data} />}
      {/* must use react context to have a provider for the grocery store??? */}
      {/* TODO:A component to hold all of the grocery store items */}
      {children}
    </>
  );
}
