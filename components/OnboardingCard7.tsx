import { defaultStyles } from "@/constants/Styles"
import { CameraType, CameraView, useCameraPermissions } from "expo-camera"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';

const OnboardingCard7 = ({width, isActive, setDisableButton}: any) => {
    const [ facing, setFacing ] = useState<CameraType>('front');
    const [ permission, requestPermission ] = useCameraPermissions();
    const [ showCamera, setShowCamera ] = useState(false);
    const cameraRef = useRef<any>(null);

    if (!permission) {
        // Camera permissions are still loading
        return <ActivityIndicator color='blue' size={24} />
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={[defaultStyles.onboardingContainer, {width: width}]}>
                <Text style={defaultStyles.onboardingTitle} >Let's scan your face</Text>
                <Text style={defaultStyles.onboardingCaption}>Take a scan of your face to let our AI model identify the best products for your skin.</Text>
                <Button onPress={requestPermission} title="Start Scan" />
            </View>
        )
    }

    async function captureCamera () {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo.uri)
            // handle the captured image here (e.g., upload it to a server or display it in the app)
        }
    }

    return (
        <Modal
        visible={showCamera}
        animationType="fade"
        >
        {/* // <View style={{width: width, paddingTop: 10, flex: 1, alignItems: 'center'}}> */}
            <CameraView style={[{/*styles.camera*/}, {width: width, paddingTop: 10, flex: 1, alignItems: 'center'}]} facing={facing}>
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.button} onPress={captureCamera}>
                        <Ionicons name="radio-button-on" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </CameraView>
    {/* //   </View> */}
        </Modal>
    )
}

export default OnboardingCard7

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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