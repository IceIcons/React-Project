import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BOOKINGS_QUERY = gql`
  query Bookings {
    bookings {
      id
      checkIn
      checkOut
      guests
      status
      listing {
        id
        title
        location
        images
        pricePerNight
      }
    }
  }
`;

const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      id
    }
  }
`;

function Bookings() {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(BOOKINGS_QUERY);

  const [cancelBooking, { loading: cancelLoading }] =
    useMutation(CANCEL_BOOKING);

  const bookings = data?.bookings || [];

  const getNights = (checkIn, checkOut) => {
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    const difference = secondDate - firstDate;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const handleCancel = (bookingId) => {
    cancelBooking({
      variables: {
        bookingId,
      },
      onCompleted: () => {
        toast.success("Booking cancelled successfully");
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
          <Button
            variant="outlined"
            sx={{ borderColor: `black`, color: `black`, marginBottom: 4 }}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, }}>
          My Bookings
        </Typography>
        {loading && (
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={180} />
            <Skeleton variant="rectangular" height={180} />
          </Stack>
        )}
        {error && <Typography color="error">{error.message}</Typography>}
        {!loading && bookings.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              You don't have any bookings yet
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/")}
            >
              View Listings
            </Button>
          </Box>
        )}
        <Stack spacing={3}>
          {bookings.map((booking) => {
            const nights = getNights(booking.checkIn, booking.checkOut);
            const totalPrice = nights * booking.listing.pricePerNight;
            return (
              <Box key={booking.id} sx={{ display: "flex", gap: 3, border: "1px solid #ddd", borderRadius: "18px", p: 2, flexDirection: { xs: "column", sm: "row", }, }}>
                <img src={booking.listing.images?.[0]} alt={booking.listing.title} style={{ width: "220px", height: "160px", objectFit: "cover", borderRadius: "12px", cursor: "pointer", }} onClick={() => navigate(`/listings/${booking.listing.id}`)} />
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700, cursor: "pointer", }} onClick={() => navigate(`/listings/${booking.listing.id}`)} >
                      {booking.listing.title}
                    </Typography>
                    <Chip label={booking.status} color={booking.status === "CONFIRMED" ? "success" : "default"} />
                  </Stack>
                  <Typography sx={{ color: "#717171", mt: 1 }}>
                    {booking.listing.location}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    {booking.checkIn} — {booking.checkOut}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    {booking.guests} guests · {nights} nights
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mt: 2,
                    }}
                  >
                    Total: ${totalPrice}
                  </Typography>
                  {booking.status === "CONFIRMED" && (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2 }}
                      loading={cancelLoading}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </section>
    </main>
  );
}

export default Bookings;
