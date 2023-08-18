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

export default function CommonGroceryStoreItem(item: CommonItemType) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [uniqueId, setUniqueId] = useState<number | null>(null);
  const itemsToSubmit = CommonItemsDataStore((state) => state.itemsToSubmit);

  // not working again1!!

  const addItemToSubmit = CommonItemsDataStore(
    (state) => state.addItemToSubmit
  );
  const updateItemToSubmit = CommonItemsDataStore(
    (state) => state.updateItemToSubmit
  );

  const removeItemToSubmit = CommonItemsDataStore(
    (state) => state.removeItemToSubmit
  );

  useEffect(() => {
    console.log(itemsToSubmit, "Items To Submit?");
  }, [itemsToSubmit]);

  const memoizedItemToAdd = useMemo(() => {
    const itemToAdd = {
      uniqueItemId: uniqueId,
      id: item.id,
      name: item.item_name,
      notes: item.item_notes,
      quantity,
      image: item.image,
    };

    console.log(itemToAdd, "Memoized Value Calculated");
    return itemToAdd;
  }, [selected, quantity, uniqueId]);

  function generateUiD() {
    console.log("generating index");
    if (itemsToSubmit.length === 0) {
      console.log("Uid is 1 ");
      setUniqueId(1);
      // return 0;
    } else {
      const highestIndex = itemsToSubmit.reduce(
        (prev, curr) => Math.max(prev, curr.uniqueItemId),
        0
      );
      console.log(
        `The highest index:${highestIndex}, The new index will be ${
          highestIndex + 1
        }`
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
      console.log("This item is checked", item.item_name);
      generateUiD(); // should only be if is true
    } else {
      setSelected(false);
    }
  }

  useEffect(() => {
    if (selected) {
      console.log(memoizedItemToAdd, "Item before adding to state to submit?");
      if (uniqueId !== null)
        addItemToSubmit(memoizedItemToAdd as CommonItemToAdd);
    } else {
      console.log(memoizedItemToAdd, "Object after selected is false");
      setQuantity(1);
      if (uniqueId !== null) removeItemToSubmit(uniqueId);
    }
  }, [selected, uniqueId]);

  useEffect(() => {
    console.log(memoizedItemToAdd.quantity, "quantity?");
    if (memoizedItemToAdd.quantity && selected) {
      console.log(quantity, "quantity");
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
    console.log("Incrementing");
    setQuantity(Number(quantity + 1));
  }
  async function decrement() {
    console.log("Decrementing");
    setQuantity(Number(quantity - 1));
  }

  const normalStyle = {
    border: 1,
    borderColor: "primary.light",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    height: 50,
    m: 1,
  };

  const selectedStyle = {
    border: 2,
    borderColor: "primary.main",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    m: 1,
  };

  return (
    <>
      <Card raised={!!selected} sx={selected ? selectedStyle : normalStyle}>
        <CardActionArea
          onClick={() => {
            handleChecked();
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              size="small"
              onChange={handleChecked}
              checked={!!selected}
              sx={{}}
            />
            <Typography variant="h5">{item.item_name}</Typography>
            <Typography variant="body2" color="text.secondary"></Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{}}>
          <IconButton
            onClick={decrement}
            aria-label="delete"
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
            value={quantity}
            type="tel"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{}}
          />

          <IconButton
          sx={{
            ml:0
          }}
            onClick={increment}
            aria-label="delete"
            disabled={selected ? false : true}
            color="primary"
          >
            <AddCircleIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
