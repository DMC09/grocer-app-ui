"use client";

import { theme } from "@/helpers/theme";
import { Container, ThemeProvider, Typography } from "@mui/material";


export default function LoginLayout({
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
            height: "100%",
            display: "flex",
            flexFlow: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "primary.light",
          }}
        >
          <Typography align="center" color="primary.dark" variant="h4">
            Welcome! Login or Sign up to Continue
          </Typography>
          {children}
        </Container>
      </ThemeProvider>
    </>
  );
}
