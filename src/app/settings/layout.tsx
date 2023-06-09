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

maxWidth={false}
          sx={{
  height:"100vh",
  backgroundColor:"primary.main"
          }}
        >
          {children}
        </Container>

        {/* This shoudl be changed  */}
      </ThemeProvider>
    </>
  );
}
