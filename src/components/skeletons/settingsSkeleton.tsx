"use client";

import { Box, Container, Skeleton } from "@mui/material";

export default function SettingsSkeleton() {
  return (
    <Container
      sx={{
        mt: 2,
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          my: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={"50%"}
          height={75}
          sx={{
            maxWidth: "400px",
          }}
        />
      </Box>
      <Box
        sx={{
          my: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={"30%"}
          height={40}
          sx={{
            maxWidth: "200px",
          }}
        />
        <Skeleton
          variant="rounded"
          width={"30%"}
          height={40}
          sx={{
            maxWidth: "200px",
            mx:1

          }}
        />
        <Skeleton
          variant="rounded"
          width={"30%"}
          height={40}
          sx={{
            maxWidth: "200px",
          }}
        />
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
        <Skeleton variant="rounded" width={"90%"} height={400} />
      </Container>
    </Container>
  );
}
