"use client";

import { ThemeProvider, Typography, Card } from "@mui/material";

import { theme } from "@/helpers/theme";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";

import AddNewStore from "../dialogs/addNewStoreDialog";
import DashboardHeaderMenu from "./dashboardHeaderMenu";

export default function DashboardHeader() {
  const selectId = useZustandStore(
    ProfileDataStore,
    (state) => state?.data?.select_id
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        {selectId && (
          <Card
            raised
            sx={{
              boxShadow: 0,
              mt: 1,
              display: "flex",
              flexFlow: "row",
              backgroundColor: "white",
            }}
          >
            <Typography
              sx={{ marginLeft: 3 }}
              color="primary.main"
              variant="h3"
            >
              Dashboard
            </Typography>
{/* Add new dashvoard header meu  */}
{/* Move all logic to that menu */}
            {/* <AddNewStore select_id={selectId} /> */}
            <DashboardHeaderMenu  />
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
