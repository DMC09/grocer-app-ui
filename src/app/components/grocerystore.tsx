"use client";

import {
  Badge,
  Box,
  CardContent,
  Collapse,
  Container,
  Divider,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroceryStoreItem from "./grocerystoreitem";
import noItems from "./noItems";
import { useEffect, useState } from "react";
import { GroceryStoreItemType, GroceryStoreWithItemsType } from "@/types";
import { theme } from "../utils/theme";
import { useSupabase } from "../supabase-provider";
import NoItems from "./noItems";

export default function GroceryStore(groceryStoreData: any) {
  const [open, setOpen] = useState(false);
  const { supabase } = useSupabase();
  const [groceryStore, setGroceryStore] =
    useState<GroceryStoreWithItemsType>(groceryStoreData);



    useEffect(() => { 
      const getGroceryStoreItems = async () => {
        const { data, error } = await supabase
          .from("grocerystoreitems")
          .select("*")
          .eq("storeId",groceryStoreData?.id)
          ;

          if(groceryStoreData) {
            console.log(groceryStoreData,'what is the data for this?')
          } else if(error) {
            console.log(error)
          }
      };
      getGroceryStoreItems()
    }, [ supabase]);




  //use effect to set up the realtime update.
  // const groceryStoreItemsToRender = groceryStore.grocerystoreitems.map(
  //   (grocerystoreitem: GroceryStoreItemType) => {
  //     return (
  //       <GroceryStoreItem key={grocerystoreitem.id} {...grocerystoreitem} />
  //     );
  //   }
  // );

  useEffect(() => {
console.log(groceryStore,'store?')
  

  }, [])

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "grocerystoreitems" },
  //       (payload) => {
  //         console.log("Update to the grocery items received!", payload);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase]);
  

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("custom-filter-channel")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "DELETE",
  //         schema: "public",
  //         table: "grocerystoreitems",
  //         filter: `storeId=eq.${groceryStore.id}`,
  //       },
  //       (payload) => {
  //         console.log("Delete received!", payload);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          sx={{
            p: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: 1,
            borderColor: "secondary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              m: 6,
              bgcolor: "background.paper",
              borderRadius: 1,
              border: 1,
              borderColor: "error.main",
            }}
          >
            <Typography variant="h1" color="text.secondary">
              {groceryStoreData.name}
            </Typography>
            <Box
            sx={{
              display: "flex",
              flexFlow: "column",
              alignSelf:"center"
            }}
            >
              <IconButton
                onClick={() => setOpen(!open)}
                aria-label="expand"
                size="small"
              >
                {open ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <Badge badgeContent={groceryStoreData?.quantity} color="secondary">
                    <TocOutlinedIcon color="error" />
                  </Badge>
                )}
              </IconButton>
            </Box>
          </Box>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              {/* <Container
                sx={{
                  border: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  bgcolor: "background.paper",
                  borderRadius: 10,
                  borderColor: "primary.main",
                }}
                style={{ overflowX: "scroll" }}
              >
                {groceryStoreItemsToRender.length > 0 ? (
                  groceryStoreItemsToRender
                ) : (
                  <NoItems storeId={groceryStore.id} />
                )}
              </Container> */}
            </CardContent>
          </Collapse>
        </Container>
      </ThemeProvider>
    </>
  );
}
