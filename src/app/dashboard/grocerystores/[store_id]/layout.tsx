import GroceryStoreHeader from "@/components/groceryStore/groceryStoreHeader";
import { DialogContextProvider } from "@/context/DialogContext";

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
      <DialogContextProvider>
        <GroceryStoreHeader />
        {children}
      </DialogContextProvider>
    </>
  );
}
