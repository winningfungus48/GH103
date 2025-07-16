import React, { createContext, useContext } from 'react';

// DailyContext scaffold for future daily challenge state
// TODO: Implement actual daily state logic in future releases (2.0.0+)
const DailyContext = createContext({
  // Example default values
  daily: null, // { date, challenge, ... }
  setDaily: () => {},
});

export const DailyProvider = ({ children }) => {
  // Placeholder: no-op provider
  return (
    <DailyContext.Provider value={{ daily: null, setDaily: () => {} }}>
      {children}
    </DailyContext.Provider>
  );
};

export const useDaily = () => {
  return useContext(DailyContext);
}; 