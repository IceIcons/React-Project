import Listings from "./Listings";
import Button from "@mui/material/Button";
import { Link } from "react-router";
import SiteHeader from "./SiteHeader";
import { useState } from "react";

function Home() {
  const [search, setSearch] = useState(``);
  return (
    <main className="site-shell">
      <SiteHeader search={search} onSearchChange={setSearch} />
      <Listings search={search} />
    </main>
  );
}
export default Home;
