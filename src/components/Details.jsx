import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { useAuth } from "./Auth";

const LISTING_DETAILS = gql`
  query ListingDetails($listingId: ID!) {
    listing(id: $listingId) {
      id
      title
      description
      images
      location
      address
      category
      amenities
      pricePerNight
      rating
      reviewsCount
      guests
      bedrooms
      beds
      bathrooms
      isFavorite
    }
  }
`;

const ADD_FAVORITE = gql`
  mutation AddFavorite($listingId: ID!) {
    addFavorite(listingId: $listingId) {
      id
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

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
    $listingId: ID!
  ) {
    createBooking(
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
      listingId: $listingId
    ) {
      id
    }
  }
`;

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const { data, loading, error, refetch } = useQuery(LISTING_DETAILS, {
    variables: {
      listingId: id,
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

  const [createBooking, { loading: bookingLoading }] =
    useMutation(CREATE_BOOKING);

  const listing = data?.listing;

  const handleFavorite = () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (listing.isFavorite) {
      removeFavorite({
        variables: {
          listingId: listing.id,
        },
        onCompleted: () => {
          toast.success("Removed from favorites");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    } else {
      addFavorite({
        variables: {
          listingId: listing.id,
        },
        onCompleted: () => {
          toast.success("Added to favorites");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
  };

  const getNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    const difference = secondDate - firstDate;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const nights = getNights();

  const totalPrice = nights > 0 ? nights * listing?.pricePerNight : 0;

  const handleReserve = () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select dates");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check out must be after check in");
      return;
    }

    if (guests < 1 || guests > listing.guests) {
      toast.error(`Guests must be between 1 and ${listing.guests}`);
      return;
    }

    createBooking({
      variables: {
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        listingId: listing.id,
      },
      onCompleted: () => {
        toast.success("Booking created successfully!");
        navigate("/bookings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
        <Skeleton variant="rectangular" height={450} sx={{ borderRadius: "20px" }} />
        <Skeleton variant="text" width="50%" height={50} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="30%" height={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">{error.message}</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5">Listing not found</Typography>
        <Button onClick={() => navigate("/listings")} sx={{ mt: 2 }}>
          View listings
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 5 }, }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }} >
        Back
      </Button>
      <Box
        sx={{ position: "relative", borderRadius: "20px", overflow: "hidden", mb: 3, }} >
        <img src={listing.images[0]} alt={listing.title} style={{ width: "100%", height: "450px", objectFit: "cover", display: "block", }} />
        <IconButton onClick={handleFavorite} sx={{ position: "absolute", right: 15, top: 15, backgroundColor: "white", }}>
          {listing.isFavorite ? (
            <FavoriteIcon sx={{ color: "red" }} />
          )
            :
            (
              <FavoriteBorderIcon />
            )}
        </IconButton>
      </Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={5} sx={{ justifyContent: "space-between", }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {listing.title}
          </Typography>
          <Typography sx={{ color: "#717171", mt: 1, }}>
            {listing.location}
          </Typography>
          <Typography sx={{ mt: 1 }}>{listing.address}</Typography>
          <Typography
            sx={{
              mt: 2,
              textTransform: "capitalize",
            }}
          >
            Type: {listing.category}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {listing.rating} · {listing.reviewsCount} reviews
          </Typography>
          <Typography sx={{ mt: 3 }}>
            {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
            {listing.beds} beds · {listing.bathrooms} bathrooms
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, }} >
              About this place
            </Typography>
            <Typography sx={{ color: "#555", lineHeight: 1.7, }}>
              {listing.description}
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, }} >
              Amenities
            </Typography>
            <Stack direction="row" spacing={1} sx={{ display: `flex`, flexWrap: `wrap` }}>
              {listing.amenities.map((amenity, index) => (
                <Box key={index} sx={{ border: "1px solid #ddd", borderRadius: "20px", px: 2, py: 1, mb: 1, }}>
                  {amenity}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
        <Box sx={{ width: { xs: "100%", md: 350, }, border: "1px solid #ddd", borderRadius: "18px", p: 3, height: "fit-content", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ${listing.pricePerNight} night
          </Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField label="Check in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            <TextField label="Check out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} InputLabelProps={{ shrink: true, }} />
            <TextField label="Guests" type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} inputProps={{ min: 1, max: listing.guests, }} />
          </Stack>
          {nights > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography>
                ${listing.pricePerNight} × {nights} nights
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, }}>
                Total: ${totalPrice}
              </Typography>
            </Box>
          )}
          <Button fullWidth variant="contained" color="error" size="large" loading={bookingLoading} sx={{ mt: 3, borderRadius: "12px", }} onClick={handleReserve} >
            Reserve
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default Details;
