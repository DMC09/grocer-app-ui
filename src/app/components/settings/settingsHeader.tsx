"use client "
import { theme } from "@/app/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { Card, Typography } from "@mui/material";

export default function SettingsHeader() {
  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        <Card
          sx={{
            display: "flex",
            flexFlow: "row",
            backgroundColor: "primary.main",
            justifyContent: "center",
          }}
        >
          <div></div>
          <Typography align="center" color="#EAEAEA" variant="h3">
            Settings
          </Typography>
        </Card>
      </ThemeProvider>
    </>
  );
}
