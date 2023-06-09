"use client"
import { Stack, Skeleton, Divider } from "@mui/material";

export default function Loading() {
  return (
    <Stack sx={{ mt: 1.5 }} spacing={3}>
      <Skeleton variant="rectangular" width={210} height={50} />
      <Divider />
      <Stack sx={{ pt: 1.5 }} spacing={3.8}>
        <Skeleton variant="rounded" width={210} height={40} />
        <Skeleton variant="rounded" width={210} height={40} />
        <Skeleton variant="rounded" width={210} height={40} />
      </Stack>

      <Stack>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    </Stack>
  );
}
