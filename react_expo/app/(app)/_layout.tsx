import { Redirect, Stack } from 'expo-router';
import {useSession} from "@/context/authContext";
import { Text } from 'react-native';



const AppLayout = ()=> {
    const { user, isLoading } = useSession();

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!user) {
        return <Redirect href="/sign-in" />;
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Réservations' }} />
{/*
            <Stack.Screen name="" options={{ title: 'QR Code' }} />
*/}
        </Stack>
    );
}

export default AppLayout;
