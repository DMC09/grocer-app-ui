"use client";

import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GroceryStoreType } from "@/types";
import AddItem from "../utils/addItem";
import GroceryStoreHeaderMenu from "./groceryStoreHeaderMenu";

export default function GroceryStoreHeader({
  id,
  name,
  image,
  quantity,
  createdAt,
}: GroceryStoreType) {
  // TODO:add realtime subscripon to this??
  const router = useRouter();
  return (
    <>
      <Card
        sx={{
          border: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "primary.main",
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
        <Typography color="#EAEAEA" variant="h3">
          {name}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <AddItem storeId={id} />
          <GroceryStoreHeaderMenu storeId={id} />
        </Box>
      </Card>
    </>
  );
}
