import { MenuItem, ListItemIcon } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useRouter } from "next/navigation";
import { useSupabase } from "../supabase/supabase-provider";
import { deleteGroceryStore } from "@/app/utils/client/groceryStore";

export default function DeleteGroceryStore({
  groceryStoreId,
}: {
  groceryStoreId: number;
}) {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  async function handleDelete() {
    await deleteGroceryStore(supabase, groceryStoreId, router);
  }

  return (
    <MenuItem onClick={handleDelete}>
      {/* need a modal to show the store settings which right now is the nmae */}
      <ListItemIcon>
        <DeleteForeverIcon fontSize="small" />
      </ListItemIcon>
      Delete Store
    </MenuItem>
  );
}
