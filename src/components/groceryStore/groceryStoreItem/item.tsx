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
import CheckIcon from "@mui/icons-material/Check";
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
        <Box
          sx={{
            backgroundColor: "primary.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
            maxWidth: "200px",
          }}
        >
          <Typography
            sx={{
              color: "secondary.main",
            }}
            variant="h5"
          >
            {groceryStoreItem?.quantity}
          </Typography>
        </Box>
        <CardActionArea onClick={handleClickOpen} sx={{ p: 0, m: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                pl: 1,
                py: 1,
                flexGrow: 3,
                backgroundColor: "background.paper",
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
                {groceryStoreItem?.notes ? groceryStoreItem?.notes : "-"}
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
            backgroundColor: "green",
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            onClick={() => handleDelete(groceryStoreItem.id.toString())}
            aria-label={`Complete ${groceryStoreItem.name}`}
          >
            <CheckIcon />
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
              justifyContent: "space-between",
              backgroundColor: "background.default",
              border: 3,
            }}
          >
            <Box
              sx={{
                borderColor: "primary.main",
                backgroundColor: "primary.main",
                flexGrow: 0.5,
                border: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexFlow: "column",
                p: 1.5,
              }}
            >
              <Typography
                fontWeight={"bold"}
                color="background.default"
                variant="h5"
              >
                {groceryStoreItem.quantity}
              </Typography>
            </Box>

            <Box
              sx={{
                pl: 2,
                py: 1,
                height: "100%",
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-around",
                alignItems: "flexStart",
                flexGrow: 5,
                borderColor: "primary.main",
              }}
            >
              <Typography align="left" color="primary.main" variant="h5">
                {groceryStoreItem?.name}
              </Typography>
              <Typography align="left" color="primary.main" variant="subtitle1">
                {groceryStoreItem.notes}
              </Typography>
            </Box>
            <Box
              sx={{
                borderColor: "primary.main",
                backgroundColor: "#FFC000",
                flexGrow: 0.5,
                borderLeft: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EditItem {...groceryStoreItem} />
            </Box>
            <Box
              sx={{
                borderColor: "primary.main",
                borderLeft: 3,
                backgroundColor: "green",
                flexGrow: 0.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{ color: "white" }}
                onClick={() => handleDelete(groceryStoreItem.id.toString())}
                aria-label={`Complete ${groceryStoreItem.name}`}
              >
                <CheckIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ border: 1 }}>
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
        </Box>
        <DialogActions
          sx={{
            p: 0,
            m: 0,
          }}
        >
          {!groceryStoreItem.common_item_id && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                p: 1,
                m: 0,
                justifyContent: "space-between",
              }}
            >
              <Box textAlign="center" sx={{ flexGrow: 3 }}>
                <>
                  <Typography variant="body2">Add To Common Items?</Typography>
                  <Switch
                    aria-label="Add to Common Items Catalog"
                    checked={!!checked}
                    onChange={handleChange}
                    inputProps={{
                      title: "Add to Common Items Catalog?",
                    }}
                  />
                </>
              </Box>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
