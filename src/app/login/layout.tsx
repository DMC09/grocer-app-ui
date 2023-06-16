"use client";
import Header from "../components/header";
import { Container, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../utils/theme";

export default function LoginLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          sx={{
            border:5,
height:"100%",
            display:"flex",
            flexFlow:"column",
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor:"primary.light"
          }}
        >
          <Typography  align="center" color="primary.dark" variant="h4">
              Welcome! Login or Sign up to Continue
            </Typography>
          {children}
        </Container>
      </ThemeProvider>
    </>
  );
}
