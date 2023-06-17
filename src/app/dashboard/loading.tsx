"use client";
import Skeleton from "@mui/material/Skeleton";

export default function Loading() {
  return (
    <>
      {/* do this  */}
      <Skeleton variant="rounded" width={350} height={200} />
      <Skeleton variant="rounded" width={350} height={200} />
      <Skeleton variant="rounded" width={350} height={200} />
    </>
  );
}
