"use client";

import Skeleton from "@mui/material/Skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <Skeleton variant="rounded" width={350} height={400} />
      <Skeleton variant="rounded" width={350} height={400} />
      <Skeleton variant="rounded" width={350} height={400} />
    </>
  );
}
