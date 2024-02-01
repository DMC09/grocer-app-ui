import { Typography } from "@mui/material";

export default function NoManagedCommonItem() {
  return (
    <>
      <Typography sx={{
mt:2
      }} align="center" variant="h5" color="primary.main">
        No common items found ...
      </Typography>
    </>
  );
}
