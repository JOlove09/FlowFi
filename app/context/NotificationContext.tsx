import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    createContext,
    useEffect,
    useState,
} from "react";

// =========================
// TYPES
// =========================

type NotificationContextType = {

  notificationsEnabled: boolean;

  warning50: boolean;

  warning80: boolean;

  warning100: boolean;

  setNotificationsEnabled:
    (value: boolean) => void;

  setWarning50:
    (value: boolean) => void;

  setWarning80:
    (value: boolean) => void;

  setWarning100:
    (value: boolean) => void;
};

// =========================
// CONTEXT
// =========================

export const NotificationContext =
  createContext<NotificationContextType | null>(
    null
  );

// =========================
// PROVIDER
// =========================

export const NotificationProvider = ({
  children,
}: any) => {

  const [
    notificationsEnabled,
    setNotificationsEnabledState,
  ] = useState(true);

  const [
    warning50,
    setWarning50State,
  ] = useState(true);

  const [
    warning80,
    setWarning80State,
  ] = useState(true);

  const [
    warning100,
    setWarning100State,
  ] = useState(true);

  // =========================
  // LOAD SETTINGS
  // =========================

  useEffect(() => {

    loadSettings();

  }, []);

  const loadSettings = async () => {

    const enabled =
      await AsyncStorage.getItem(
        "notificationsEnabled"
      );

    const w50 =
      await AsyncStorage.getItem(
        "warning50"
      );

    const w80 =
      await AsyncStorage.getItem(
        "warning80"
      );

    const w100 =
      await AsyncStorage.getItem(
        "warning100"
      );

    if (enabled !== null)
      setNotificationsEnabledState(
        JSON.parse(enabled)
      );

    if (w50 !== null)
      setWarning50State(
        JSON.parse(w50)
      );

    if (w80 !== null)
      setWarning80State(
        JSON.parse(w80)
      );

    if (w100 !== null)
      setWarning100State(
        JSON.parse(w100)
      );
  };

  // =========================
  // SAVE FUNCTIONS
  // =========================

  const setNotificationsEnabled =
    async (value: boolean) => {

      setNotificationsEnabledState(
        value
      );

      await AsyncStorage.setItem(
        "notificationsEnabled",
        JSON.stringify(value)
      );
    };

  const setWarning50 =
    async (value: boolean) => {

      setWarning50State(value);

      await AsyncStorage.setItem(
        "warning50",
        JSON.stringify(value)
      );
    };

  const setWarning80 =
    async (value: boolean) => {

      setWarning80State(value);

      await AsyncStorage.setItem(
        "warning80",
        JSON.stringify(value)
      );
    };

  const setWarning100 =
    async (value: boolean) => {

      setWarning100State(value);

      await AsyncStorage.setItem(
        "warning100",
        JSON.stringify(value)
      );
    };

  return (

    <NotificationContext.Provider
      value={{

        notificationsEnabled,

        warning50,

        warning80,

        warning100,

        setNotificationsEnabled,

        setWarning50,

        setWarning80,

        setWarning100,
      }}
    >

      {children}

    </NotificationContext.Provider>
  );
};