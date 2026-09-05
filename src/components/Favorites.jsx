import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Box, Typography, Skeleton } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import ListingCard from "./ListingCard";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FAVORITES_QUERY = gql`
  query Favorites {
    favorites {
      id
      title
      pricePerNight
      images
      isFavorite
    }
  }
`;

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($listingId: ID!) {
    removeFavorite(listingId: $listingId) {
      id
    }
  }
`;

function Favorites() {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(FAVORITES_QUERY);

  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

  const favorites = data?.favorites || [];

  const handleRemoveFavorite = (listingId) => {
    removeFavorite({
      variables: {
        listingId,
      },
      onCompleted: () => {
        toast.success("Removed from favorites");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <main className="site-shell">
      <section className="listings-section">
        <Box component={Link} to={"/"}>
          <Button variant="outlined" sx={{ borderColor: `black`, color: `black`, marginBottom: 4 }} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Box>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mb: 4, }}
        >
          My Favorites
        </Typography>
        {loading ? (<div className="listing-grid">
          {new Array(4).fill(0).map((_, i) => (
            <div className="card" key={i}>
              <Skeleton variant="rectangular" height={180} style={{ width: '100%', borderRadius: `16px` }} />
              <Box sx={{ pt: 1.5, width: '100%' }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </div>
          ))}
        </div>)
          :
          (
            <div className="listing-grid">
              {favorites.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onFavorite={handleRemoveFavorite} />
              ))}
            </div>
          )
        }
        {!loading && favorites.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No favorite listings yet
            </Typography>
            <Button variant="contained" color="error" onClick={() => navigate("/")}>
              View Listings
            </Button>
          </Box>
        )}

      </section>
    </main>
  );
}

export default Favorites;
