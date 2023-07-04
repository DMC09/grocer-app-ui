"use client";

import { ThemeProvider, Typography, Card, Box } from "@mui/material";
import { theme } from "../utils/theme";
import AddStore from "./utils/addStore";
import useStore from "../hooks/useStore";
import { useProfileStore } from "@/state/ProfileStore";


export default function DashboardHeader() {
  const selectId = useStore(
    useProfileStore,
    (state) => state?.data?.select_id
  );


  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        {selectId && (
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
              <AddStore select_id={selectId} />
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
