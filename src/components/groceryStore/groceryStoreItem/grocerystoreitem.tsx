"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { GroceryStoreItemProps, GroceryStoreItemType } from "@/types";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";




import {
  GroceryDataStore,
  findGroceryStoreIndex,
} from "@/stores/GroceryDataStore";

import { addToCommonItemCatalog } from "@/helpers/commonItem";

import { theme } from "@/utils/theme";
import { useSupabase } from "@/components/supabase/supabase-provider";
import EditItem from "@/components/utils/grocerystoreitems/editItem";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";



export default function Item({ groceryStoreItem }: GroceryStoreItemProps) {
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<boolean | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [progress, setProgress] = useState(0);

  // function updatedRecently(timestamp: string | Date | null) {
  //   if (timestamp) {
  //     // Convert the timestamp to a Date object.
  //     const passedDate = new Date(timestamp).getTime();

  //     // Get the current time in milliseconds.
  //     const now = Date.now();

  //     // Return true if the passedDate is within the last 5 minutes.
  //     return passedDate > now - 300000;
  //   } else {
  //     return false;
  //   }
  // }

  const created_atLocal = () => {
    if (groceryStoreItem?.created_at) {
      const localDate = new Date(
        groceryStoreItem?.created_at
      ).toLocaleTimeString([], {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
      });
      return localDate;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  async function handleClickOpen() {
    setOpen(true);
  }

  async function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  const handleDelete = async (itemId: string) => {
    //State to determine the click
    //Countdown and display the x
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .delete()
      .eq("id", itemId)
      .select()
      .single();
    if (error) {
      throw new Error(error?.message);
    } else {
      if (data && data.id) {
        fetchData();
      }
    }
  };


  async function handleChange(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    setChecked(event.target.checked);

    // Needa  new Util function called addToCommonItemCatalog

    if (checked) {
      addToCommonItemCatalog(supabase, groceryStoreItem);
    }
  }


  return (
    <>
      <Card
        sx={{
          border: 2,
          borderColor: "primary.main",
          display: "flex",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <CardActionArea onClick={handleClickOpen} sx={{ p: 0, m: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.main",
                height: 5,
                width: 5,
                p: 1.25,
                m: 1,
                borderRadius: 30,
                border: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  lineHeight: "normal",
                  color: "secondary.main",
                }}
                variant="h6"
              >
                {groceryStoreItem?.quantity}
              </Typography>
            </Box>
            <Typography align="center" sx={{ marginLeft: 4 }} variant="h5">
              {groceryStoreItem?.name}
            </Typography>
          </Box>
        </CardActionArea>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <CircularProgress variant="determinate" value={progress} /> */}
          <IconButton
            sx={{ p: 0.5, m: 0, marginLeft: "auto" }}
            color="success"
            onClick={() => handleDelete(groceryStoreItem.id.toString())}
            aria-label="complete"
          >
            <CheckCircleIcon />
          </IconButton>
        </Box>
      </Card>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "background.paper",
          },
        }}
        fullWidth
        maxWidth={"xs"}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ display: "flex", flexFlow: "column" }}>
          <Box
            sx={{
              display: "flex",
              p:1,
              justifyContent: "space-between",
              backgroundColor: "#454545",
            }}
          >
            <Box
              sx={{
                p: 1,

                flexGrow: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexFlow: "column",
              }}
            >
              <Typography color="background.default" variant="h6">
                {groceryStoreItem.quantity}
              </Typography>
            </Box>

            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-around",
                alignItems: "center",
                flexGrow: 3,
              }}
            >
              <Typography
                color="background.default"
                variant="h5"
                align="center"
              >
                {groceryStoreItem?.name}
              </Typography>
              <Typography color="background.default" variant="subtitle1">
                {groceryStoreItem.notes}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <EditItem {...groceryStoreItem} />
            </Box>
          </Box>
          <CardMedia
            component="img"
            height={250}
            image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStoreItem?.image}`}
            alt={`Image of${groceryStoreItem.name} `}
            sx={{
              objectFit: "fill",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </Box>
        <DialogActions>
          <Box
            sx={{

              width:"100%",
              display:"flex"
            }}
          >
            {!groceryStoreItem.cid && (
              <>
                <Box textAlign="center" sx={{ }}>
                  <Typography variant="body2">Add To Common Items</Typography>
                  <Switch
                    checked={!!checked}
                    onChange={handleChange}
                    inputProps={{
                      title: "controlled",
                    }}
                  />
                </Box>
              </>
            )}
            
            <IconButton
              sx={{
                color: "primary.dark",
                ml:"auto"
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
