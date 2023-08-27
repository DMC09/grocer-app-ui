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

import { CommonItemType } from "@/types";
import EditItem from "@/components/utils/grocerystoreitems/editItem";
import CloseIcon from "@mui/icons-material/Close";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCommonItem, getAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "@/components/supabase/supabase-provider";
import EditCommonItem from "./editCommonItem";

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
    setOpen(false);
  }

  return (
    <>
      <Card
        raised
        sx={{
          borderRadius: 3,
          border: 3,
          width: "50%",
          height: "fit-content",
          overflow: "visible",
        }}
      >
        {/* open dialog */}
        <CardActionArea
          onClick={() => {
            handleClickOpen();
          }}
          sx={{
            p: 0,
            m: 0,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0,
            }}
          >
            <CardMedia
              component="img"
              image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${item?.image}`}
              alt={`Image of ${item.item_name} `}
              sx={{
                height: 100,
                width: 100,
                borderTopLeftRadius: 9,
                borderBottomLeftRadius: 9,
              }}
            />
            <Box sx={{ pl: 2 }}>
              <Typography align="left" variant="h5">
                {item.item_name}
              </Typography>
              <Typography align="left" variant="body2" color="text.secondary">
                {item.item_notes}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
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
              border: 1,
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#454545",
            }}
          >
            <IconButton
              aria-label="Delete Common Item"
              sx={{
                color: "red",
                flexGrow: 2,
              }}
              onClick={handleDelete}
            >
              <DeleteForeverIcon />
            </IconButton>

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
                {item?.item_name}
              </Typography>
              <Typography color="background.default" variant="subtitle1">
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
            </Box>
          </Box>
          <CardMedia
            component="img"
            height={250}
            image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${item?.image}`}
            alt={`Image of ${item.item_name} `}
            sx={{
              objectFit: "fill",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </Box>
        <DialogActions>
          <IconButton
            sx={{
              color: "primary.dark",
            }}
            onClick={handleClose}
            aria-label="Close Item Preview"
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
