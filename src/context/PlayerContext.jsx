import React, { createContext, useContext } from "react";

// PlayerContext scaffold for future multiplayer/user state
// TODO: Implement actual player state logic in future releases (2.0.0+)
const PlayerContext = createContext({
  // Example default values
  player: null, // { id, name, ... }
  setPlayer: () => {},
});

export const PlayerProvider = ({ children }) => {
  // Placeholder: no-op provider
  return (
    <PlayerContext.Provider value={{ player: null, setPlayer: () => {} }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};
