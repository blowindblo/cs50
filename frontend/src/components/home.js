import React from "react";
import GetDevice from "./getdevice.jsx";
import WebPlayback from "./WebPlayback";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get } from "../utils/get.js"; // function to send request to API

function Home() {
  const ACCESS_TOKEN = useContext(Context);
  const [profile, setProfile] = useState({}); // profile is an obj hence {}
  const [TopArtists, setTopArtists] = useState([]); // array
  const [TopTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get profile data
    const getProfile = async () => {
      const profile = await get(
        "https://api.spotify.com/v1/me",
        "GET",
        ACCESS_TOKEN
      );

      setProfile(profile);
      // console.log(profile);
    };

    // Get top artists
    const getTopArtists = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/top/artists",
        "GET",
        ACCESS_TOKEN
      );
      const TopArtists = await response.items.map(function (d) {
        return { name: d.name, id: d.id, genres: d.genres };
      });

      setTopArtists(TopArtists);
      // console.log(TopArtists)
    };

    // Get top tracks
    const getTopTracks = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/top/tracks?" +
          queryString.stringify({
            limit: "50",
            time_range: "long_term",
          }),
        "GET",
        ACCESS_TOKEN
      );
      const TopTracks = await response.items.map(function (d) {
        return { name: d.name, id: d.id, album: d.album.name };
      });

      // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
      return TopTracks;
      // getAudioFeatures(TopTracks);
    };

    // Get audio features of tracks
    const getAudioFeatures = async (tracks) => {
      const feat = await get(
        "https://api.spotify.com/v1/audio-features?" +
          queryString.stringify({
            ids: tracks.map((d) => d.id).join(","),
          }),
        "GET",
        ACCESS_TOKEN
      );
      const TopTracksFeat = await tracks.map((d, index) => {
        return { ...d, features: feat.audio_features[index] };
      });

      setTopTracks(TopTracksFeat);
      // console.log(TopTracksFeat[0].features.valence);
      console.log(TopTracksFeat);
    };

    // Run all async functions in parallel first. When they are done, set loading to false
    Promise.all([
      getProfile(),
      getTopArtists(),
      getTopTracks().then((d) => getAudioFeatures(d)),
    ]).then(() => {
      setLoading(false);
      console.log("Done!");
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Home</div>
      <div>{ACCESS_TOKEN}</div>
      <div>
        {ACCESS_TOKEN ? <div>Profile: {profile.display_name}</div> : "null"}
      </div>
      {/* <div>Top Artists {JSON.stringify(TopArtists.name)}</div>
      <ol>
        {TopArtists.map((d) => (
          <li key={d.name}>
            {d.name} Genre: {d.genres[0]}{" "}
          </li>
        ))}
      </ol>
      <ol>
        {TopTracks.map((d) => (
          <li key={d.name}>
            {d.name} {d.features.valence}
          </li>
        ))}
      </ol> */}
      {/* <a href="/player">Player</a> */}
      {/* <WebPlayback /> */}
      <GetDevice />
    </>
  );
}

export default Home;
