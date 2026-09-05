import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router";
import { useAuth } from "./Auth";

function ListingsToolbar() {
  const { accessToken } = useAuth();
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3, mb: 5, flexWrap: "wrap", }}
    >
      <Box
        component={Link}
        to={!accessToken ? "/login" : "/favorites"}
        sx={{ width: { xs: "100%", sm: "320px", }, height: "150px", borderRadius: "20px", border: "1px solid #eeeeee", display: "flex", alignItems: "center", justifyContent: "center", gap: 2, textDecoration: "none", color: "#222", boxShadow: "0 5px 20px rgba(0,0,0,0.06)", transition: "0.25s", }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1280px-Heart_coraz%C3%B3n.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail" style={{ width: "55px", height: "55px", }} />
        <Stack>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, }}
          >
            Favorites
          </Typography>
          <Typography variant="body2" sx={{ color: "#717171", mt: 0.5, }} >
            Your saved places
          </Typography>
        </Stack>
      </Box>
      <Box
        component={Link}
        to={!accessToken ? "/login" : "/bookings"}
        sx={{ width: { xs: "100%", sm: "320px", }, height: "150px", borderRadius: "20px", border: "1px solid #eeeeee", display: "flex", alignItems: "center", justifyContent: "center", gap: 2, textDecoration: "none", color: "#222", boxShadow: "0 5px 20px rgba(0,0,0,0.06)", transition: "0.25s", }}
      >
        <img
          src="https://thumbs.dreamstime.com/b/colorful-books-icon-logo-colorful-books-icon-logo-white-background-141938439.jpg"
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
          }}
        />
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, }} >
            My Bookings
          </Typography>
          <Typography variant="body2" sx={{ color: "#717171", mt: 0.5, }}>
            Manage your trips
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default ListingsToolbar;
