import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function AddNewCategory() {
  function handleClickOpen(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Button
        onClick={handleClickOpen}
        aria-label="Add New Common item"
        endIcon={<AddCircleIcon />}
        size="large"
      />
    </>
  );
}
