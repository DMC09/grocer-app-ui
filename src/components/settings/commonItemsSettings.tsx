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
      <Container sx={{}}>
        <ReactPullToRefresh
          onRefresh={handleRefresh}
          style={{ textAlign: "center" }}
        >
          <Box
            id="edit-button-container"
            sx={{
              display: "flex",
              flexFlow: "column",
              borderColor: "primary.main",
              backgroundColor: "background.paper",
              borderRadius: 8,
              border: 2,
              p: 2,
              mt: 2,
              boxShadow: 5,
            }}
          >
            <>
              <AddCommonItem />
            </>
            {commonItemsToRender}
          </Box>
        </ReactPullToRefresh>
      </Container>
    </>
  );
}
