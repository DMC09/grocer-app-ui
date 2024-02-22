import { Box, CircularProgress, Container } from "@mui/material";
import PullToRefresh from "react-simple-pull-to-refresh";
import AddCommonItem from "../dialogs/addCommonItemDialog";
import NoManagedCommonItem from "../utils/commonitems/noManagedCommonItems";
import AddNewCategory from "../dialogs/addNewCategory";

export default function CategoriesSettings() {
  function handleRefresh(): Promise<any> {
    throw new Error("Function not implemented.");
  }

  return (
    <>
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
            ></Box>
            <AddNewCategory />
            <p>testing</p>
          </Container>
        </PullToRefresh>
      </>
    </>
  );
}
