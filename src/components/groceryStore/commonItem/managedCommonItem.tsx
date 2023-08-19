import {
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Box,
  CardMedia,
  Dialog,
  DialogActions,
  Switch,
} from "@mui/material";
import { useState } from "react";
import item from "../groceryStoreItem/item";
import { CommonItemType } from "@/types";
import EditItem from "@/components/utils/grocerystoreitems/editItem";
import CloseIcon from "@mui/icons-material/Close";
import EditCommonItem from "./editCommonItem";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCommonItem, getAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "@/components/supabase/supabase-provider";

export default function ManagedCommonItem(item: CommonItemType) {
  const [uniqueId, setUniqueId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { supabase, session } = useSupabase();

  function handleClickOpen() {
    setOpen(true);
  }

  async function handleClose() {
    setOpen(false);
  }

  async function fetchData() {

    await getAllCommonItems(supabase);
  }

  async function handleDelete() {
    const deletedCommonItemId = await deleteCommonItem(supabase, item.id);

    if (deletedCommonItemId) {
      await fetchData();
    }
    setOpen(false)
  }

  return (
    <>
      <Card raised sx={{}}>
        {/* open dialog */}
        <CardActionArea
          onClick={() => {
            handleClickOpen();
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{item.item_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.item_notes}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{}}></CardActions>
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
          <CardMedia
            component="img"
            image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${item?.image}`}
            alt={`Image of${item.item_name} `}
            sx={{
              objectFit: "fill",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <Box
            sx={{
              borderBottom: 1,
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "background.paper",
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
            ></Box>

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
              <Typography variant="h5" align="center">
                {item?.item_name}
              </Typography>
              <Typography color="#071236" variant="subtitle1">
                {item.item_notes}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <EditCommonItem {...item} />
              <IconButton
                sx={{
                  color: "red",
                }}
                onClick={handleDelete}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <IconButton
            sx={{
              color: "primary.dark",
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
