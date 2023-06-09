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
            height: "100vh",
            border: 1,
            borderColor: "blue",
            display:"flex",
            flexFlow:"row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* create a good loading one. */}
          {/* move all the container stuff here */}
          {/* <Typography variant="body1" color="text.secondary">
            Please sign in to use
          </Typography> */}
          {children}
        </Container>
      </ThemeProvider>
    </>
  );
}
