"use client";
import { DialogContextProvider } from "@/context/DialogContext";
import { theme } from "@/helpers/theme";
import { Container, ThemeProvider } from "@mui/material";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider theme={theme}>
      <DialogContextProvider>
        
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
        </DialogContextProvider>
      </ThemeProvider>
    </>
  );
}
