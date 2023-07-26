"use client";

import { ThemeProvider, Typography, Card } from "@mui/material";

import AddStore from "../utils/addStore";

import { theme } from "@/utils/theme";
import useZustandStore from "@/hooks/useZustandStore";
import { useProfileStore } from "@/stores/ProfileDataStore";


export default function DashboardHeader() {
  const selectId = useZustandStore(useProfileStore, (state) => state?.data?.select_id);

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
              variant="h2"
            >
              Dashboard
            </Typography>

            <AddStore select_id={selectId} />
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
