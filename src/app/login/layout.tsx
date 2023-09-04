"use client";

import { theme } from "@/helpers/theme";
import {
  Card,
  CardMedia,
  Container,
  ThemeProvider,
  Typography,
} from "@mui/material";
import logo from "../../../Logo.png";

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
         
          <Card

              sx={{
                background: "none",
                height: 100,
                width: 100,
                boxShadow:0
              }}
            >
              <CardMedia
                sx={{ objectFit: "fill" }}
                component="img"
                image={"../../../Logo.png"}
                alt={`Preview  `}
              />
            </Card>
            <Typography align="center" color="primary.dark" variant="h4">
          
Login or Sign up to Continue
        </Typography>
          {children}
        </Container>
      </ThemeProvider>
    </>
  );
}
