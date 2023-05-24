"use client";
import Skeleton from "@mui/material/Skeleton";
import DashBoardSkeleton from "./components/skeletons/dashboardSkeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // make thi more like the contianer like a big loading one?
  return (

    <Skeleton
      sx={{ bgcolor: "grey.900" }}
      variant="rounded"
      width={500}
      height={500}
    />
  );
}
