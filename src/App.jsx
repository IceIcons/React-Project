import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Register from "./components/Register";
import { ApolloProvider } from "@apollo/client/react";
import { ToastContainer } from "react-toastify";
import { client } from "./components/graphql-client";
import "./App.css";
import Login from "./components/Login";
import Details from "./components/Details";
import Favorites from "./components/Favorites";
import Bookings from "./components/Bookings";
import { useEffect } from "react";

function App() {
  const isRegisterOpen = true;

  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register open={isRegisterOpen} />} />
        <Route path="/login" element={<Login open={isRegisterOpen} />} />
        <Route path="/listings/:id" element={<Details />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <ToastContainer />
    </ApolloProvider>
  );
}

export default App;
