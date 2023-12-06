import GroceryStoreHeader from "@/components/groceryStore/header/groceryStoreHeader";


export default async function GroceryStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    store_id: number;
  };
}) {
  return (
    <>
      <GroceryStoreHeader />
      {children}
    </>
  );
}
