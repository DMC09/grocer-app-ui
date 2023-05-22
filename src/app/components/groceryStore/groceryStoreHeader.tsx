"use client";

import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GroceryStoreType } from "@/types";
import AddItem from "../utils/addItem";

export default function GroceryStoreHeader({
  id,
  name,
  image,
  quantity,
  createdAt,
}: GroceryStoreType) {
  // maybe add realtime subscripon to this??
  const router = useRouter();
  return (
    <>
      <Card
        sx={{
          border: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        <IconButton
          onClick={() => router.back()}
          aria-label="add to grocery store"
          color="secondary"
          size="large"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="h3" color="text.secondary">
          {name}
        </Typography>
        <Box>
          <AddItem storeId={id} />
        </Box>
      </Card>
    </>
  );
}
