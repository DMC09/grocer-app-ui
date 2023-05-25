import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditItem() {
  return (
    <Box sx={{}}>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label="add to grocery store"
      >
        <EditIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Box>
  );
}
