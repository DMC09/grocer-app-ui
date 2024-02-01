import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Box,
  CardMedia,
  Dialog,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { CommonItemType } from "@/types";
import CloseIcon from "@mui/icons-material/Close";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCommonItem, fetchAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "@/components/supabase/supabase-provider";
import EditCommonItem from "../../dialogs/editCommonItemDialog";

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
    await fetchAllCommonItems(supabase);
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
          height: "15%",
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
                objectFit: "cover",
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
        <DialogActions
          sx={{
            display: "flex",
            backgroundColor: "#454545",
          }}
        >
          {/* <IconButton
            sx={{
              color: "primary.dark",
            }}
            onClick={handleClose}
            aria-label="Close Item Preview"
          >
            <CloseIcon />
          </IconButton> */}
          <Box
            sx={{
              backgroundColor: "#454545",
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <IconButton
              aria-label="Delete Common Item"
              sx={{
                color: "red",
              }}
              onClick={handleDelete}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              backgroundColor: "#454545",
            }}
          >
            <EditCommonItem {...item} />
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
