import {SessionProvider} from "@/context/authContext";
import { Slot } from 'expo-router';
// Import your global CSS file
import "../assets/global.css";

const RootLayout = () =>  {
  return (<SessionProvider>
    <Slot />
  </SessionProvider>)
}

export default RootLayout;
