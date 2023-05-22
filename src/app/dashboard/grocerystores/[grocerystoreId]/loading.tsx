"use client"

import Skeleton from "@mui/material/Skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <Skeleton sx={{color:"green"}} variant="rectangular" width={210} height={118} />;
}
