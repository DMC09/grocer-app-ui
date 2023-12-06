"use client";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  addToCommonItemCatalog,
  fetchAllCommonItems,
} from "@/helpers/commonItem";
import { ChangeEvent, useEffect, useState } from "react";
import { GroceryStoreItemProps } from "@/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useSupabase } from "@/components/supabase/supabase-provider";
import EditItem from "@/components/utils/grocerystoreitems/editItem";
import { fetchAllGroceryStores, fetchAllItems } from "@/helpers/groceryStore";
import { theme } from "@/helpers/theme";

export default function Item({ groceryStoreItem }: GroceryStoreItemProps) {
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<boolean | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function handleClickOpen() {
    setOpen(true);
  }

  async function handleClose() {
    setOpen(false);
  }

  async function fetchData() {
    await fetchAllGroceryStores(supabase);
    await fetchAllItems(supabase);
  }

  const handleDelete = async (itemId: string) => {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .delete()
      .eq("id", itemId)
      .select();
    if (error) {
      console.error(error?.message);
      throw new Error("Error when deleting item");
    } else {
      console.log("successfully deleted item");
      if (data) {
        await fetchData();
      }
    }
  };

  async function handleChange(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    setChecked(event.target.checked);
    if (checked) {
      addToCommonItemCatalog(supabase, groceryStoreItem);
      fetchAllCommonItems(supabase);
    }
  }

  return (
    <>
      <Card
        sx={{
          m: 1.5,
          border: 1,
          borderColor: "primary.main",
          display: "flex",
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
                p: 1,
                m: 1,
                height: 20,
                width: 20,
                borderRadius: 15,
                border: 2,
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
            <Box
              sx={{
                height: "100%",
                width: "100%",
                ml: 1,
              }}
            >
              <Typography align="left" sx={{}} variant="h5">
                {groceryStoreItem?.name}
              </Typography>
              <Typography
                color="secondary.dark"
                align="left"
                sx={{}}
                variant="body1"
              >
                {groceryStoreItem?.notes}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <IconButton
            sx={{}}
            color="success"
            onClick={() => handleDelete(groceryStoreItem.id.toString())}
            aria-label={`Complete ${groceryStoreItem.name}`}
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
              p: 1,
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
            alt={`Image of ${groceryStoreItem.name} `}
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
              width: "100%",
              display: "flex",
            }}
          >
            {!groceryStoreItem.common_item_id && (
              <>
                <Box textAlign="center" sx={{}}>
                  <Typography variant="body2">Add To Common Items</Typography>
                  <Switch
                    aria-label="Add to Common Items Catalog"
                    checked={!!checked}
                    onChange={handleChange}
                    inputProps={{
                      title: "Add to Common Items Catalog?",
                    }}
                  />
                </Box>
              </>
            )}

            <IconButton
              aria-label="Close Item Preview"
              sx={{
                color: "primary.dark",
                ml: "auto",
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
