import GroceryStoreHeader from "@/app/components/groceryStore/groceryStoreHeader";

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
