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
import ManagedCommonItem from "../grocerystore/commonItem/managedCommonItem";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";
import { getAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "../supabase/supabase-provider";
import AddCommonItem from "../grocerystore/commonItem/addCommonItem";

export default function CommonItemsSettings() {
  const commonItemsCatalog = CommonItemsDataStore((state) => state.catalog);
  const { supabase, session } = useSupabase();
  const commonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <ManagedCommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  async function handleRefresh() {
    await getAllCommonItems(supabase);
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

        {commonItemsToRender}
      </Container>
    </>
  );
}
