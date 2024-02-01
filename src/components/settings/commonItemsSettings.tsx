import { Container, CircularProgress, Box } from "@mui/material";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemType } from "@/types";
import ManagedCommonItem from "../groceryStore/commonItem/managedCommonItem";
import { fetchAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "../supabase/supabase-provider";
import AddCommonItem from "../dialogs/addCommonItemDialog";
import NoManagedCommonItem from "../utils/commonitems/noManagedCommonItems";
import PullToRefresh from "react-simple-pull-to-refresh";

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
      <PullToRefresh
        refreshingContent={<CircularProgress />}
        pullingContent={""}
        onRefresh={handleRefresh}
      >
        <Container
          sx={{
            display: "flex",
            flexFlow: "column",
            borderColor: "primary.main",
            backgroundColor: "background.default",

            width: "100%",
            mt: 2,
            overflowY: "scroll",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
        >
            <AddCommonItem />
          </Box>

          {commonItemsCatalog.length > 0 ? (
            <Container
              sx={{
                gap: 2,
                height: "90%",
                overflowY: "scroll",
                display: "flex",
                flexFlow: "column",
                py:2,
                my:2
              }}
            >
              {commonItemsToRender}
            </Container>
          ) : (
            <NoManagedCommonItem />
          )}
        </Container>
      </PullToRefresh>
    </>
  );
}
