import { CategoryType } from "@/types";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import item from "../groceryStore/groceryStoreItem/item";
import EditCategory from "../dialogs/editCategory";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCategory, fetchAllCategories } from "@/helpers/category";
import { useSupabase } from "../supabase/supabase-provider";

export default function Category(category: CategoryType) {


  const { supabase, session } = useSupabase();

  async function handleDelete() {
    await deleteCategory(supabase, category.id);
    await fetchAllCategories(supabase);
  }

  return (
    <>
      <Card
        raised
        sx={{
          borderRadius: 3,
          border: 3,
          height: "100%",
          width: "90%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0,
            m: 0,
            flexGrow: 5,
          }}
        >
          <Box sx={{ pl: 2 }}>
            <Typography align="left" variant="h5">
              {category.name}
            </Typography>
          </Box>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            p: 0,
            "&:last-child": { pb: 0 },
            border:1
          }}
        >
            <EditCategory {...category} />
          <IconButton
            aria-label="Delete Category"
            sx={{
              width: "50%",
              height: "100%",
              borderRadius: 0,
              borderBottomRightRadius:3,
              borderTopRightRadius:3,
              color: "background.default",
              backgroundColor: "#8B0000",
              border:0,
              borderColor:"black"
            }}
            onClick={handleDelete}
          >
            <DeleteForeverIcon />
          </IconButton>
          

        </CardContent>
      </Card>
    </>
  );
}
