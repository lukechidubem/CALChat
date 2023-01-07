// provider === component
import { createContext, useEffect } from "react";
import { defaultSettings } from "../config";
import useLocalStorage from "../hooks/useLocalStorage";

const initialState = {
  ...defaultSettings,

  // Mode
  onToggleMode: () => {},
};

const SettingsContext = createContext(initialState);

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage("settings", {
    themeMode: initialState.themeMode,
    themeLayout: initialState.themeLayout,
    themeStretch: initialState.themeStretch,
    themeContrast: initialState.themeContrast,
    themeDirection: initialState.themeDirection,
    themeColorPresets: initialState.themeColorPresets,
  });

  // Mode

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === "light" ? "dark" : "light",
    });
  };

  // Reset

  return (
    <SettingsContext.Provider
      value={{
        ...settings, // Mode
        onToggleMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext };

export default SettingsProvider;
