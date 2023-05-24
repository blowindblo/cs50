import { MdFavorite, MdFavoriteBorder, MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdArrowDropDownCircle } from "react-icons/md";
// import React, { useState, useContext, useEffect } from "react";

const iconSize = 24;

export const HeartIcon = ({ is_saved, onClick }) => {
  const Icon = is_saved ? MdFavorite : MdFavoriteBorder;
  const iconColor = is_saved ? "red" : "black";

  return (
    <div>
      <Icon onClick={onClick} style={{ fill: iconColor, cursor: "pointer", height: iconSize - 5, width: iconSize - 5 }} />
    </div>
  );
}

export const PlayPauseIcon = ({ is_paused, onClick }) => {
  const Icon = is_paused ? MdPlayArrow : MdPause;
  const iconColor = "black";

  return (
    <div>
      <Icon onClick={onClick} style={{ fill: iconColor, cursor: "pointer", height: iconSize + 7, width: iconSize + 7 }} />
    </div>
  );
}

export const NextIcon = ({ onClick }) => {
  const Icon = MdSkipNext;
  const iconColor = "black";
  
  return (
    <div>
      <Icon onClick={onClick} style={{ fill: iconColor, cursor: "pointer", height: iconSize, width: iconSize }} />
    </div>
  );
}

export const PrevIcon = ({ onClick }) => {
  const Icon = MdSkipPrevious;
  const iconColor = "black";

  return (
    <div>
      <Icon onClick={onClick} style={{ fill: iconColor, cursor: "pointer", height: iconSize, width: iconSize }} />
    </div>
  );
}


export const ToggleOverlayIcon = ({ visible, onClick }) => {
  const Icon = MdArrowDropDownCircle;
  const rotation = visible ? "rotate(180deg)" : "";
  const iconColor = "grey";

  return (
    <div>
      <Icon onClick={onClick} style={{ fill: iconColor, cursor: "pointer", height: iconSize, width: iconSize, transform: rotation }} />
    </div>
  );
}

