import {
  createContext,
  ReactNode,
  useState,
} from "react";

type ThemeContextType = {

  mode: string;

  setMode: (mode: string) => void;
};

export const ThemeContext =
  createContext<ThemeContextType | null>(
    null
  );

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [mode, setMode] =
    useState("light");

  return (

    <ThemeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >

      {children}

    </ThemeContext.Provider>
  );
};