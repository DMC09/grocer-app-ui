import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemToAdd, CommonItemType } from "@/types";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function CommonItem(item: CommonItemType) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [uniqueId, setUniqueId] = useState<number | null>(null);
  const itemsToSubmit = CommonItemsDataStore((state) => state.itemsToSubmit);

  const addItemToSubmit = CommonItemsDataStore(
    (state) => state.addItemToSubmit
  );
  const updateItemToSubmit = CommonItemsDataStore(
    (state) => state.updateItemToSubmit
  );

  const removeItemToSubmit = CommonItemsDataStore(
    (state) => state.removeItemToSubmit
  );

  const memoizedItemToAdd = useMemo(() => {
    const itemToAdd = {
      uniqueItemId: uniqueId,
      id: item.id,
      name: item.item_name,
      notes: item.item_notes,
      quantity,
      image: item.image,
      categoryId: item.category_id ? item.category_id : null,
    };

    console.log(itemToAdd, "Memoized Value Calculated");
    return itemToAdd;
  }, [selected, quantity, uniqueId]);

  function generateUiD() {
    console.log("generating index");
    if (itemsToSubmit.length === 0) {
      setUniqueId(1);
      // return 0;
    } else {
      const highestIndex = itemsToSubmit.reduce(
        (prev, curr) => Math.max(prev, curr.uniqueItemId),
        0
      );

      setUniqueId(highestIndex + 1);
    }
  }

  async function handleChecked(
    event?: ChangeEvent<HTMLInputElement>,
    checked?: boolean
  ) {
    if (!selected) {
      setSelected(true);

      generateUiD();
    } else {
      setSelected(false);
    }
  }

  useEffect(() => {
    if (selected) {
      if (uniqueId !== null)
        addItemToSubmit(memoizedItemToAdd as CommonItemToAdd);
    } else {
      setQuantity(1);
      if (uniqueId !== null) removeItemToSubmit(uniqueId);
    }
  }, [selected, uniqueId]);

  useEffect(() => {
    if (memoizedItemToAdd.quantity && selected) {
      updateItemToSubmit(
        memoizedItemToAdd.uniqueItemId as number,
        memoizedItemToAdd.quantity as number
      );
    }
  }, [memoizedItemToAdd.quantity]);

  async function handleQuantityChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (event.target.value) {
      setQuantity(Number(event.target.value));
    }
  }

  async function increment() {
    setQuantity(Number(quantity + 1));
  }
  async function decrement() {
    setQuantity(Number(quantity - 1));
  }

  const normalStyle = {
    border: 1,
    borderColor: "primary.light",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    m: 1,
    height: "25%",
  };

  const selectedStyle = {
    border: 3,
    borderColor: "primary.main",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    m: 1,
    height: "25%",
  };

  return (
    <>
      <Card raised={!!selected} sx={selected ? selectedStyle : normalStyle}>
        <CardActionArea
          sx={{ p: 1 }}
          onClick={() => {
            handleChecked();
          }}
        >
          <Box sx={{}}>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
              color="primary.main"
              variant="h5"
            >
              {item.item_name}
            </Typography>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
              color="secondary.dark"
              variant="body1"
            >
              {item.item_notes}
            </Typography>
          </Box>
        </CardActionArea>

        <CardActions sx={{}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={decrement}
              aria-label={`Decrement ${item.item_name}`}
              disabled={(selected ? false : true) || quantity < 2}
              color="primary"
            >
              <RemoveCircleIcon />
            </IconButton>

            <TextField
              size={"small"}
              InputProps={{
                inputMode: "numeric",
                sx: {
                  "& input": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    width: 30,
                    p: 0,
                    m: 0,
                  },
                },
              }}
              sx={{}}
              onChange={(e) => {
                handleQuantityChange(e);
              }}
              disabled={selected ? false : true}
              value={selected ? quantity : 0}
              type="tel"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ "aria-label": `${item.item_name}'s quantity` }}
            />

            <IconButton
              sx={{
                ml: 0,
              }}
              onClick={increment}
              aria-label={`Increment ${item.item_name}`}
              disabled={selected ? false : true}
              color="primary"
            >
              <AddCircleIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </>
  );
}
