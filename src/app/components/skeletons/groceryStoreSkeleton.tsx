"use client";

import { Box, Container, Skeleton } from "@mui/material";

export default function GroceryStoreSkeleton() {
  return (
    <Container
    sx={{
      mt:3,
      height: "100vh",
      width: "100%",
    }}
  >
    <Container
      disableGutters
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Skeleton variant="rounded" width={"70%"} height={100} />
      <Skeleton variant="rounded" width={"70%"} height={100} />
      <Skeleton variant="rounded" width={"70%"} height={100} />
      <Skeleton variant="rounded" width={"70%"} height={100} />
      <Skeleton variant="rounded" width={"70%"} height={100} />
    </Container>
  </Container>
  );
}
