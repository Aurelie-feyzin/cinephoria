import { useImage, Image } from 'expo-image';
import { Text } from 'react-native';

const ViewImage = ({backdrop}: {backdrop: string}) =>  {
    const image = useImage(`https://image.tmdb.org/t/p/original/${backdrop}`, {
        maxWidth: 800,
        onError(error, retry) {
            console.error('Loading failed:', error.message);
        }
    });

    if (!image) {
        return <Text>Image en chargement...</Text>;
    }

    return <Image source={image} style={{ width: '100%', height: 150, alignSelf: 'center', resizeMode: 'contain' }} className="rounded-lg p-2"/>;
}

export default ViewImage;
