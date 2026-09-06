import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import Listings from "./components/Listings";

function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <Listings />
      <Footer />
    </main>
  );
}
export default Home;
