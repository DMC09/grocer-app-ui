import { Box, CircularProgress, Container } from "@mui/material";
import PullToRefresh from "react-simple-pull-to-refresh";
{
}
import AddNewCategory from "../dialogs/addNewCategoryDialog";
import { fetchAllCategories } from "@/helpers/category";
import { useSupabase } from "../supabase/supabase-provider";
import { CategoryType } from "@/types";
import { CategoryDataStore } from "@/stores/categoryDataStore";
import Category from "../utils/categories/category";
import { useEffect } from "react";
import NoCategories from "../utils/placeholders/noCategories";

export default function CategoriesSettings() {
  const { supabase, session } = useSupabase();

  const categories = CategoryDataStore((state) => state?.categories);

  async function handleRefresh() {
    fetchAllCategories(supabase);
  }

  const categoriesToRender = categories?.map((category: CategoryType) => {
    return <Category key={category.id} {...category} />;
  });

  useEffect(() => {
    console.log(categories, "tst");
  }, []);

  return (
    <>
      <>
        <PullToRefresh
          refreshingContent={<CircularProgress />}
          pullingContent={""}
          onRefresh={handleRefresh}
        >
          <Container
            sx={{
              display: "flex",
              flexFlow: "column",
              borderColor: "primary.main",
              backgroundColor: "background.default",

              width: "100%",
              mt: 2,
              overflowY: "scroll",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            ></Box>
            <AddNewCategory />
            {categories && categories.length > 0 ? (
              <Container
                sx={{
                  gap: 2,
                  height: "90%",
                  overflowY: "scroll",
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                  my: 2,
                }}
              >
                {categoriesToRender}
              </Container>
            ) : (
              <NoCategories />
            )}
          </Container>
        </PullToRefresh>
      </>
    </>
  );
}
