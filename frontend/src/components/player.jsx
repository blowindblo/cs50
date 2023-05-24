import React, { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get, toggle } from "../utils/get.js";
import {
  HeartIcon,
  PlayPauseIcon,
  NextIcon,
  PrevIcon,
  ToggleOverlayIcon,
} from "../utils/icon";

export default function Player({ DeviceID }) {
  const ACCESS_TOKEN = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [is_paused, setPaused] = useState();
  const [is_saved, setSaved] = useState();
  const [currPlaying, setCurrPlaying] = useState({});
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // Check playback state 
  const getPlaybackState = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/player?" +
        queryString.stringify({
          additional_types: "track",
        }),
      "GET",
      ACCESS_TOKEN
    );

    if (response !== "") {
      const { is_playing, item, device } = await response;
      // on first load (i.e. is_paused is null), set state for pause
      // subsequently, do not change state when running this function
      if (is_paused == null) {
        setPaused(!is_playing);
      }
      const currentlyPlaying = {
        id: item.id,
        name: item.name,
        album: item.album,
        artists: item.artists.map((artist) => artist.name),
        image: item.album.images[2].url,
        device: {
          id: device.id,
          name: device.name,
          type: device.type,
          vol: device.volume_percent,
        },
      };

      setCurrPlaying(currentlyPlaying);

      checkSaved(currentlyPlaying.id);
      console.log(currentlyPlaying);
    } else {
      console.log(response);
    }
  };

  // Check if track is already saved
  const checkSaved = async (track_id) => {
    const response = await get(
      "https://api.spotify.com/v1/me/tracks/contains?" +
        queryString.stringify({
          ids: track_id,
        }),
      "GET",
      ACCESS_TOKEN
    );
    setSaved(...response);
  };

  // Save or Delete track
  const addOrRemoveTrack = async (track_id, save = true) => {
    const method = save ? "PUT" : "DELETE";
    await toggle(
      "https://api.spotify.com/v1/me/tracks?" +
        queryString.stringify({
          ids: track_id,
        }),
      method,
      ACCESS_TOKEN
    );
    setSaved(save ? true : false);
    // add a check if fetch is successful, then toggle save/unsave
  };

  // Play or Pause track
  const playPause = async () => {
    const playpause = is_paused ? "play" : "pause";
    toggle(
      `https://api.spotify.com/v1/me/player/${playpause}?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "PUT",
      ACCESS_TOKEN
    );
    setPaused(!is_paused);
    getPlaybackState();
  };

  // Skip to next/previous track
  const changeTrack = async (direction) => {
    await toggle(
      `https://api.spotify.com/v1/me/player/${direction}?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "POST",
      ACCESS_TOKEN
    );
    setTimeout(() => {
      getPlaybackState().then(() => setLoading(false));
    }, 1000);
  };

  // Play track given uri
  const playspecificsong = async () => {
    setLoading(true);
    toggle(
      `https://api.spotify.com/v1/me/player/play?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "PUT",
      ACCESS_TOKEN,
      {
        body: JSON.stringify({
          context_uri: "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr", // only albums/artists/playlists
          // uris:    // only tracks
          offset: {
            position: 5,
          },
        }),
      }
    );
    setPaused(false);
    getPlaybackState().then(() => setLoading(false));
  };

  useEffect(() => {
    getPlaybackState().then(() => setLoading(false));
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Curently playing on: {currPlaying.device.name}</div>
      <ToggleOverlayIcon onClick={toggleOverlay} visible={visible} />
      {visible && (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
            <img
              src={currPlaying.image}
              alt={currPlaying.album.name}
              album
              art
            />
            <div style={{flex: 0.05}}></div>
            <div style={{alignSelf: "center"}}>
              <div>{currPlaying.name} {currPlaying.album.name}</div>
              <div>{currPlaying.artists.join(", ")}</div>
              
            </div>
            <div style={{flex: 0.1}}></div>
            <HeartIcon
              onClick={() => {
                addOrRemoveTrack(currPlaying.id, is_saved ? false : true);
              }}
              is_saved={is_saved}
            />

          </div>
          <div style={{ display: "flex", alignSelf: "center", alignItems: "center", justifyContent: "center", flex: 1}}>
            <p></p>
            <PrevIcon
              className="btn-spotify"
              onClick={() => {
                changeTrack("previous");
              }}
            />

            <PlayPauseIcon
              className="btn-spotify"
              onClick={() => {
                playPause();
              }}
              is_paused={is_paused}
            />

            <NextIcon
              className="btn-spotify"
              onClick={() => {
                changeTrack("next");
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flex: 1}}>
            Volume</div>
        </div>
      )}

      <button
        className="specificsong"
        onClick={() => {
          playspecificsong();
        }}
      >
        play specific song
      </button>
    </>
  );
}
