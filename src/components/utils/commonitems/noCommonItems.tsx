import { Box, Container, Typography } from "@mui/material";

export default function NoCommonItems() {
  return (
    <>


<Container
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          alignItems:"center",
          textAlign: "center",
          height: "80%",
          p: 1,
        }}
      >
        <Typography variant="h4" color="text.secondary">
        No common items found ...
        </Typography>
      </Container>
    
    </>
  );
}
