import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import ListingCard from "./ListingCard";
import ListingsToolbar from "./ListingsToolbar";
import Pagination from "./Pagination";
import { Box, Grid, Skeleton, Stack } from "@mui/material";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const listingsQuery = gql`
  query Listings($limit: Int, $page: Int, $search: String) {
    listings(limit: $limit, page: $page, search: $search) {
      items {
        id
        title
        pricePerNight
        images
        isFavorite
      }
      pagination {
        total
        totalPages
        limit
        page
      }
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

`


function Listings({ search }) {
  const [page, setPage] = useState(1);
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const { data, loading, error, refetch } = useQuery(listingsQuery, {
    variables: { limit: 8, page: page - 1, search: search },
  });

  const [addFavorite, { error: addFavErr }] = useMutation(ADD_FAVORITE, { onCompleted: () => refetch() });
  const [removeFavorite, { error: removeFavErr }] = useMutation(REMOVE_FAVORITE, { onCompleted: () => refetch() })

  const totalPages = data?.listings?.pagination?.totalPages;
  console.log(page);

  return (
    <section className="listings-section">
      <ListingsToolbar />
      <div className="listing-grid">
        {loading ? (
          <div className="listing-grid">
            {new Array(8).fill(0).map((_, i) => (
              <div className="card" key={i}>
                <Skeleton variant="rectangular" height={180} style={{ width: '100%', borderRadius: `16px` }} />
                <Box sx={{ pt: 1.5, width: '100%' }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </div>
            ))}
          </div>
        ) : (
          data?.listings?.items?.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onFavorite={(listingId) => {
                if (!accessToken) {
                  navigate(`/login`)
                }
                else {
                  if (listing?.isFavorite) {
                    removeFavorite({ variables: { listingId } })
                    toast.success("Removed from favorites");
                  }
                  else {
                    addFavorite({ variables: { listingId } })
                    toast.success("Added to favorites");
                  }
                }
              }
              }
            />
          ))

        )}
        {error && <p className="listing-message">{error.message}</p>}
        {data?.listings?.pagination.total == 0 && (
          <h2 className="listing-message">No Results</h2>
        )}
      </div>
      {!loading && (
        <Pagination page={page} count={totalPages} currentPage={page} showFirstButton totalPages={totalPages} onPageChange={setPage} />
      )}
    </section>
  );
}
export default Listings;
