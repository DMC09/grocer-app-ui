import GroceryStoreHeader from "@/app/components/groceryStore/groceryStoreHeader";
import { getGroceryStoreData } from "@/app/utils/server/getData";

export const revalidate = 0;

export default async function GroceryStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    store_id: number;
  };
}) {
  const groceryStore = await getGroceryStoreData(params.store_id);

  return (
    <>
      {groceryStore && <GroceryStoreHeader {...groceryStore} />}
      {children}
    </>
  );
}
