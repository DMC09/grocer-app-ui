"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect, useMemo, useState } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { GroceryStoreWithItemsType, GroceryStoreType } from "@/types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";
import DashboardHeader from "../components/dashboardHeader";
import { PostgrestError } from "@supabase/supabase-js";
import GroceryStore from "../components/groceryStore/groceryStore";
import NoStores from "../components/utils/noStores";

export default function Dashboard() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [open, setOpen] = useState(false);
  const [groceryStores, setGroceryStores] = useState<
    GroceryStoreType[] | [] | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODo: implment backgrou MUI when doing stuff?

  const getAllGroceryStores = async () => {
    const {
      data,
      error,
    }: { data: GroceryStoreType[] | [] | null; error: PostgrestError | null } =
      await supabase.from("grocerystores").select("*");
    if (data) {
      setIsLoading(false);
      setGroceryStores(data);
    } else if (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllGroceryStores();
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystore-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // TODO: Put this in to a componeont
  const groceryStoresToRender = groceryStores?.map(
    (groceryStore: GroceryStoreType) => {
      return <GroceryStore key={groceryStore.id} {...groceryStore} />;
    }
  );

  return (
    <>
      <DashboardHeader />
      <Container
        maxWidth={false}
        sx={{
          height: "85%",
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "primary.light",
          overflowY: "scroll",
          gap: 3.5,
          py: 4,
          border: 2,
        }}
      >
        {/* this needs it's own container */}
        {groceryStores && groceryStores.length > 0 ? (
          groceryStoresToRender
        ) : (
          <NoStores />
        )}
      </Container>
    </>
  );
}
