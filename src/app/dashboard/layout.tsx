"use client";
import Header from "../components/header";
import { Container, ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";
import DashboardHeader from "../components/dashboardHeader";

export default function DashboardLayout({
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
