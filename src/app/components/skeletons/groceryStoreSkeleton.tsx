"use client";

import { Container, Skeleton } from "@mui/material";

export default function DashBoardSkeleton() {
  return (
    <>
      <Container
        sx={{
          border: 1,
        }}
      >
        <Skeleton variant="rectangular" width={500} height={200} />
      </Container>
    </>
  );
}
