"use client";

import { Box, Container, Skeleton } from "@mui/material";

export default function DashBoardSkeleton() {
  return (
    <Container
      sx={{
        mt:3,
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          my: 2,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          variant="rounded"
          width={"50%"}
          height={50}
          sx={{
            maxWidth: "400px",
          }}
        />
        <Skeleton variant="rounded" width={"8%"} height={50} />
      </Box>
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
