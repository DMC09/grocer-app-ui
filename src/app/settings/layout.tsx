"use client";

import { Container, ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            height: "100vh",
            width: "100%",
            backgroundColor: "background.default",
            border: 3,
          }}
        >
          {children}
        </Container>
      </ThemeProvider>
    </>
  );
}
