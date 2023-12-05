import {
  Container,
  Box,
  Card,
  CardMedia,
  TextField,
  IconButton,
} from "@mui/material";
import EditProfileSettings from "./editProfileSettings";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemType } from "@/types";
import ManagedCommonItem from "../groceryStore/commonItem/managedCommonItem";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";
import { fetchAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "../supabase/supabase-provider";
import AddCommonItem from "../dialogs/addCommonItemDialog";
import NoManagedCommonItem from "../utils/commonitems/noManagedCommonItems";

export default function CommonItemsSettings() {
  const commonItemsCatalog = CommonItemsDataStore((state) => state.catalog);
  const { supabase, session } = useSupabase();
  const commonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <ManagedCommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  async function handleRefresh() {
    await fetchAllCommonItems(supabase);
  }

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          alignItems:"center",
          borderColor: "primary.main",
          backgroundColor: "background.default",
          px: 4,
          mt: 1,
          boxShadow: 2,
          height: "80%",
          overflowY: "scroll",
          gap: 2,
        }}
      >
        <>
          <AddCommonItem />
        </>

        {commonItemsCatalog.length > 0 ? commonItemsToRender : <NoManagedCommonItem />}
      </Container>
    </>
  );
}
