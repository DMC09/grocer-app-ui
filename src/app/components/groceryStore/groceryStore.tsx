import { GroceryStoreProps } from "@/types";
import {
  Badge,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSupabase } from "../supabase/supabase-provider";
import { useState } from "react";




export default function GroceryStore({ groceryStore, expanded }: GroceryStoreProps) {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  return (
    <>
      { expanded ? (
        <Badge color="secondary" badgeContent={groceryStore.quantity}>
          <Card
            key={groceryStore.id}
            raised
            sx={{
              border: 1,
              borderColor: "primary",
              background: "primary",
              borderRadius: 1,
              maxHeight: 300,
              width: 300,
            }}
            style={{ flexShrink: 0 }}
          >
            <CardActionArea
              onClick={() => {
                router.push(`/dashboard/grocerystores/${groceryStore?.id}`);
              }}
            >
              <CardHeader title={groceryStore.name} />
              <CardMedia
                height={250}
                width={300}
                component="img"
                image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStore?.image}`}
                alt={`Image of${groceryStore.name} `}
                sx={{ objectFit: "fill" }}
              />
            </CardActionArea>
          </Card>
        </Badge>
      ):  <Badge color="secondary" badgeContent={groceryStore.quantity}>
      <Card
        key={groceryStore.id}
        raised
        sx={{
          border: 1,
          borderColor: "primary",
          background: "primary",
          borderRadius: 1,
          height: "fit-content",
          width: 200,
        }}
        style={{ flexShrink: 0 }}
      >
        <CardActionArea
          onClick={() => {
            router.push(`/dashboard/grocerystores/${groceryStore?.id}`);
          }}
        >
          <CardHeader style={{ textAlign: 'center' }} title={groceryStore.name} />
        </CardActionArea>
      </Card>
    </Badge>}
    </>
  );
}
