import React, { useState, useEffect, useContext } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get, toggle } from "../utils/get.js";


function WebPlayback({ DeviceID }) {
  const ACCESS_TOKEN = useContext(Context);

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const track = {
    name: "",
    album: {
      name: "",
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  };
  const [current_track, setTrack] = useState(track);
  // console.log(DeviceID);

  const getVolume = async () => {
    player.getVolume().then((vol) => {
      console.log(vol);
    });
  };

  const togglePlay = async () => {
    player.togglePlay().then(() => {
      console.log("play");
    });
  }; 
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (callback) => {
          callback(ACCESS_TOKEN);
        },
        volume: 0.5,
      });

      // player.disconnect();
      setPlayer(player);
      console.log(player);
      player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
      });
    
      player.addListener("player_state_changed", (state) => {
        // console.log((({name, album, artists}) => ({name, album, artists}))(state.track_window.current_track));
        if (!state) {
          return;
        }

        console.log(state);

        const current_state = {
          id: state.track_window.current_track.id,
          name: state.track_window.current_track.name,
          album: {
            name: state.track_window.current_track.album.name,
            image: state.track_window.current_track.album.images[2].url,
          },
          artists: state.track_window.current_track.artists.map(
            (artist) => artist.name
          ),
        };
        setTrack(current_state);

        console.log(current_state);
        state.paused ? setPaused(true) : setPaused(false);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.addListener("ready", ( data ) => {
        console.log("Ready with Device ID", data.device_id);
        player.activateElement();

        // const play = async () => {
        //   toggle(
        //     `https://api.spotify.com/v1/me/player/play?` +
        //       queryString.stringify({
        //         device_id: data.device_id,
        //       }),
        //     "PUT",
        //     ACCESS_TOKEN
        //   );
        //   setPaused(!is_paused);
        // };
        // play();

      });

      player.addListener("not_ready", ( data ) => {
        console.log("Device ID has gone offline", data.device_id);
      });


      player.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );        
        }
      });
    };

    // console.log(current_track);
  }, []);

  return (
    <>
      <p>
        {current_track.name} - {current_track.artists.join(", ")}
      </p>
      <div className="container">
        <div className="main-wrapper">
          <button
            className="btn-spotify"
            onClick={() => {
              player.previousTrack();
            }}
          >
            &lt;&lt;
          </button>

          <button
            className="btn-spotify"
            onClick={() => {
              player.togglePlay();
            }}
          >
            {is_paused ? "PLAY" : "PAUSE"}
          </button>

          <button
            className="btn-spotify"
            onClick={() => {
              togglePlay();
            }}
          >
            {is_paused ? "PLAY" : "PAUSE"}
          </button>

          <button
            className="btn-spotify"
            onClick={() => {
              player.nextTrack();
            }}
          >
            &gt;&gt;
          </button>
          <button
            className="vol-spotify"
            onClick={() => {
              getVolume();
            }}
          >
            getvol
          </button>
        </div>
      </div>
    </>
  );
}

export default WebPlayback;
