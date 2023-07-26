"use client";

import { ThemeProvider, Typography, Card } from "@mui/material";

import AddStore from "../utils/addStore";

import { theme } from "@/utils/theme";
import useStore from "@/hooks/useStore";
import { useProfileStore } from "@/state/ProfileStore";

export default function DashboardHeader() {
  const selectId = useStore(useProfileStore, (state) => state?.data?.select_id);

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
