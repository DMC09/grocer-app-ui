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
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "primary.main",
          backgroundColor: "background.default",
          boxShadow: 2,
          height: "80%",
          overflowY: "scroll",
          gap: 2,
          width: "100%",
        }}
      >
        <Box>
          <AddCommonItem />
        </Box>

          <PullToRefresh
            refreshingContent={<CircularProgress />}
            pullingContent={""}
            onRefresh={handleRefresh}
          >
            <>
              {commonItemsCatalog.length > 0 ? (
                commonItemsToRender
              ) : (
                <NoManagedCommonItem />
              )}
            </>
          </PullToRefresh>
      </Container>
    </>
  );
}
