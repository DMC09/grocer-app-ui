"use client";

import { ThemeProvider, Typography, Card, Box } from "@mui/material";
import { theme } from "../utils/theme";
import AddStore from "./utils/addStore";
import useStore from "../hooks/useStore";
import { useProfileStore } from "@/state/store";

export default function DashboardHeader() {
  const newSelectId = useStore(
    useProfileStore,
    (state) => state.data.select_id
  );

  console.log(newSelectId, "select_id from zustand");

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        {newSelectId && (
          <Card
            sx={{
              display: "flex",
              flexFlow: "row",
              backgroundColor: "primary.main",
              justifyContent: "space-between",
            }}
          >
            <div></div>
            <Typography color="secondary.main" variant="h3">
              Dashboard
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddStore select_id={newSelectId} />
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
