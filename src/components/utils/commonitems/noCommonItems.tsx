import { Box, Typography } from "@mui/material";

export default function NoCommonItems() {
  return (
    <>
      <Box
        sx={{

          height: "100%",
          display:"flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent:"center"
        }}
      >
        <Typography
          sx={{
            width: "80%",
          }}
          align="center"
          variant="h5"
          color="primary.main"
        >
          No Common Items found, add one in the settings, or quickly add one
          from an existing item.
        </Typography>
      </Box>
    </>
  );
}
