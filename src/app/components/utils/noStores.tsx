import { Container, Typography } from "@mui/material";

export default function NoStores() {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          textAlign: "center",
          p: 1,
          border: 1,
        }}
      >
        <Typography variant="h4" color="text.secondary">
          No Stores yet, please add one!
        </Typography>
      </Container>
    </>
  );
}
