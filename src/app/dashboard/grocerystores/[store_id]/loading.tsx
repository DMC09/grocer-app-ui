"use client";

import GroceryStoreSkeleton from "@/app/components/skeletons/groceryStoreSkeleton";
import { Container, Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { Divider } from "@supabase/ui";

export default function Loading() {
  return <GroceryStoreSkeleton />;
}
