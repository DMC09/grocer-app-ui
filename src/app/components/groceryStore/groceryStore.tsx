import { GroceryStoreType } from "@/types";
import {
  Badge,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function GroceryStore(groceryStore: GroceryStoreType) {
  const router = useRouter();
  return (
    <>
      <Badge color="secondary" badgeContent={groceryStore.quantity}>
        <Card
          key={groceryStore.id}
          raised
          sx={{
            border: 1,
            borderColor: "primary",
            background: "primary",
            borderRadius: 1,
            width: 350,
            height: 300,
          }}
          style={{ flexShrink: 0 }}
        >
          <CardActionArea
            onClick={() => {
              router.push(`/dashboard/grocerystores/${groceryStore?.id}`);
            }}
          >
            <CardHeader title={groceryStore.name} />
            <CardMedia
              component="img"
              height={250}
              width={250}
              image={
                `${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStore?.image}` ||
                ""
              }
              alt={`Image of${groceryStore.name} `}
              sx={{ objectFit: "cover" }}
            />
            {/* <CardContent></CardContent> */}
          </CardActionArea>
          {/* <CardActions></CardActions> */}
        </Card>
      </Badge>
    </>
  );
}
