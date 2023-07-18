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
          height: "100%",
          p: 1,
        }}
      >
        <Typography variant="h4" color="primary.main">
          No stores found, please add one!
        </Typography>
      </Container>
    </>
  );
}
