import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CommonItemToAdd, CommonItemType } from "@/types";
import { Box, Card, Checkbox, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

export default function CommonGroceryStoreItem(item: CommonItemType) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [index, setNewIndex] = useState<number | null>(null);
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
    // cid and stuff needs to be thought out for
    const itemToAdd = {
      index: index,
      id: item.id,
      name: item.item_name,
      notes: item.item_notes,
      quantity,
      image: item.image,
    };

    return itemToAdd;
  }, [selected, quantity]);

  function generateIndex() {
    return itemsToSubmit.length;
  }

  async function handleChecked(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    if (checked) {
      setSelected(checked);
      setNewIndex(generateIndex());
    } else {
      setSelected(checked);
      setQuantity(1);
    }
  }

  useEffect(() => {
    if (selected) {
      addItemToSubmit(memoizedItemToAdd as any);
    } else {
      removeItemToSubmit(memoizedItemToAdd.index as number);
    }
  }, [selected]);

  // need to get styles object for selected andone for not styles

  async function handleQuantityChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    console.log(event.target.value, "updated qty");
    if (event.target.value) {
      setQuantity(Number(event.target.value));
      updateItemToSubmit(
        memoizedItemToAdd.index as number,
        Number(event.target.value)
      );
    }
  }

  return (
    <Box
      sx={{
        border: selected ? 3 : 1,
        display: "flex",
        m: 1,
        height: "33%",
      }}
    >
      <Checkbox size="small" onChange={handleChecked} checked={!!selected} />
      <Card
        sx={{
          display: "flex",
          p: 1,
        }}
      >
        <Typography variant="h5">{item.item_name}</Typography>
      </Card>
      {selected ? (
        <TextField
          value={quantity}
          type="number"
          onChange={(e) => {
            handleQuantityChange(e);
          }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
      ) : (
        <TextField
          disabled
          value={quantity}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    </Box>
  );
}
