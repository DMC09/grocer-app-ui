"use client";
import Skeleton from "@mui/material/Skeleton";
import DashBoardSkeleton from "./components/skeletons/dashboardSkeleton";

export default function Loading() {
  return (
    <Skeleton
      sx={{ bgcolor: "grey.900" }}
      variant="rounded"
      width={500}
      height={500}
    />
  );
}
