"use client";

import Skeleton from "@mui/material/Skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton variant="rounded" width={350} height={400} />
      <Skeleton variant="rounded" width={350} height={400} />
      <Skeleton variant="rounded" width={350} height={400} />
    </>
  );
}
