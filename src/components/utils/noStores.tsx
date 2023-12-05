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
          backgroundColor: "white",
          height: "80%",
          p: 1,
        }}
      >
        <Typography variant="h4" color="text.secondary">
          No stores available...
        </Typography>
      </Container>
    </>
  );
}
