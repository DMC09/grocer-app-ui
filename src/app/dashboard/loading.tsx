"use client";
import { Box, Container, Divider } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import DashboardHeader from "../components/dashboard/dashboardHeader";
import DashBoardSkeleton from "../components/skeletons/dashboardSkeleton";

export default function Loading() {
  return <DashBoardSkeleton />;
}
