import { GroceryStoreProps } from "@/types";
import {
  Badge,
  Box,
  Card,
  CardActionArea,
  CardHeader,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSupabase } from "../supabase/supabase-provider";

export default function GroceryStore({
  groceryStore,
}: GroceryStoreProps) {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  return (
    <>
      <Box
        sx={{
          p:1.5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{

            width: "100%",
            maxWidth:750,
            display:"flex",
            justifyContent: "center",

          }}
        >
          <Card
            key={groceryStore.id}
            raised
            sx={{
              border: 1,
              display: "flex",
              justifyContent: "center",
              borderRadius: 1,
              p: 1.5,
              width: "100%",
            }}
          >
            <CardActionArea
              onClick={() => {
                router.push(`/dashboard/grocerystores/${groceryStore?.id}`);
              }}
            >
              <CardHeader
                titleTypographyProps={{ variant: "h5" }}
                style={{ textAlign: "left" }}
                title={groceryStore.name}
              />
            </CardActionArea>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  color: "background.paper",
                  backgroundColor: "primary.main",
                },
              }}
              badgeContent={groceryStore.quantity}
            />
          </Card>
        </Box>
      </Box>
    </>
  );
}
