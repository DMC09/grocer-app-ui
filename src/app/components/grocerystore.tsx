"use client";

import { Badge, Container, Divider } from "@mui/material";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import GroceryStoreItem from "./grocerystoreitem";

export default function GroceryStore(data: any) {
  const groceryStoreItemsToRender = data.grocerystoreitems.map((grocerystoreitem:any)=>{
    return <GroceryStoreItem key={grocerystoreitem.id} {...grocerystoreitem}/>
  })

  return (
    <>
      <Container sx={{ mt: 2 }} maxWidth="sm">
        <Badge badgeContent={data?.quantity} color="secondary">
          <TocOutlinedIcon color="error" />
        </Badge>
        <h1>{data.name}</h1>
        {groceryStoreItemsToRender}
      </Container>
      <Divider variant="middle" />
    </>
  );
}
