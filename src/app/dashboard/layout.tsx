"use client";
import { Container, ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
        disableGutters
          sx={{

            height: "100vh",
            width:"100%",
            backgroundColor: "white",
          }}
        >
          {children}
        </Container>

        {/* This shoudl be changed  */}
      </ThemeProvider>
    </>
  );
}
