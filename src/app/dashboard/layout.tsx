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
maxWidth={false}
          sx={{
  height:"100vh",
  backgroundColor:"primary.dark",
  

          }}
        >
          {children}
        </Container>

        {/* This shoudl be changed  */}
      </ThemeProvider>
    </>
  );
}
