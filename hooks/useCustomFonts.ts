import { useFonts } from "expo-font";

export default function useCustomFonts() {

  const [fontsLoaded] = useFonts({

    CormorantRegular: require("../assets/fonts/CormorantGaramond-Regular.ttf"),

    CormorantBold: require("../assets/fonts/CormorantGaramond-Bold.ttf"),

    CormorantSemiBold: require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
  });

  return fontsLoaded;
}