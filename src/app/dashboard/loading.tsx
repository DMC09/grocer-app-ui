"use client";
import Skeleton from "@mui/material/Skeleton";
import DashBoardSkeleton from "../components/skeletons/dashboardSkeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      {/* do this  */}
      <Skeleton variant="rounded" width={350} height={200} />
      <Skeleton variant="rounded" width={350} height={200} />
      <Skeleton variant="rounded" width={350} height={200} />
    </>
  );
}
