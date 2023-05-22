"use client"
import Header from "../components/header";
import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";

export default function DashboardLayout({
  
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {


  // need to grab t
  return (
    <>
        <ThemeProvider theme={theme}>
      <section>{children}</section>
</ThemeProvider>

    </>
  );
}
