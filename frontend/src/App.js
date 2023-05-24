import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Context } from "./utils/context.js";
import GetDevice from "./components/getdevice";

function App() {
  const [ACCESS_TOKEN, setAccessToken] = useState("");
  const [REFRESH_TOKEN, setRefreshToken] = useState("");

  useEffect(() => {
    getToken();
  }, []);

  // Retrieve token and save it
  const getToken = async () => {
    function getHashparams() {
      var hashParams = {};
      var e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      e = r.exec(q);
      while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
      }
      return hashParams;
    }
    const data = getHashparams();
    console.log(ACCESS_TOKEN);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };

  return (
    // Context.provider allows ACCESS_TOKEN to be used in all components inside it
    <Context.Provider value={ACCESS_TOKEN}>
      {ACCESS_TOKEN ? <Home /> : <Login />}
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ACCESS_TOKEN ? <Home /> : <Login />} />
          <Route path="/player" exact element={ACCESS_TOKEN ? <GetDevice /> : <>"null"</>} />
        </Routes>
      </BrowserRouter> */}
    </Context.Provider>
  );
}

export default App;
