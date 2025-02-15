import { defaultStyles } from "@/constants/Styles"
import { useState } from "react"
import { Button, StyleSheet, View } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";

const OnboardingCard7 = ({width, setScan}: any) => {
  const [image, setImage] = useState<string | null>(null);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setScan(result.assets[0].uri);
    }
  };

  return (
    <View style={[defaultStyles.onboardingContainer, {width: width}]}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
    )
}

export default OnboardingCard7

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
        
      flex: 1,
      marginBottom: '5%',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      bottom: 0,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
    captureButton: {
        width: 50,
        height: 50,
        
        // borderRadius: 35,
        // backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
      },
      innerCaptureButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
      },
  });