import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { PostgrestError } from "@supabase/supabase-js";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function AddStore() {
  const { supabase, session } = useSupabase();

  const [open, setOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");

  const getSelectId = useMemo(async (): Promise<number | null> => {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("profiles").select("select_id").single();
    if (data) {
      return data?.select_id;
    } else {
      throw new Error(error?.message);
    }
  }, []);

  async function validation() {
    if (newGroceryStoreName.trim() === "") {
      setIsInvalid(true);
      setErrorText("Please enter a name");
      return false;
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9]+$/;
    if (!regExp.test(newGroceryStoreName)) {
      setErrorText("Please only use letters and number");
      setIsInvalid(true);
      return false;
    } else {
      setIsInvalid(false);
      console.log("Validation successful");
      return true;
    }
  }

  async function handleClickOpen() {
    setOpen(true);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setNewGroceryStoreName(event.target.value);
    setErrorText(null);
    setIsInvalid(null);
  }

  function handleClose(event: {}): void {
    setOpen(false);
    setNewGroceryStoreName("");
    setErrorText(null);
    setIsInvalid(null);
  }

  async function handleSubmit() {
    const isValidResult = await validation();

    if (isValidResult) {
      console.log("form submiting??");
      const select_id = await getSelectId;
      const { data, error } = await supabase
        .from("grocerystores")
        .insert([{ name: newGroceryStoreName, select_id }]);
      if (error) {
        throw new Error(error.message);
      } else {
        setOpen(false);
        setNewGroceryStoreName("");
      }
    } else {
      console.log("we coudln't take this submittions");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<AddCircleIcon />}
        sx={{ fontSize: 80 }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new Store</DialogTitle>
        <DialogContent>
          <TextField
            error={isInvalid || undefined}
            helperText={isInvalid && errorText}
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={newGroceryStoreName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
