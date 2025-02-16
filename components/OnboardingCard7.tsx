import { defaultStyles } from "@/constants/Styles"
import { useState, useRef } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform, Dimensions } from "react-native"
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import * as MediaLibrary from 'expo-media-library';

const OnboardingCard7 = ({width, setScan}: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const isSimulator = Device.isDevice === false;

  const screenHeight = Dimensions.get('window').height;

  const startScan = async () => {
    if (isSimulator) {
      Alert.alert(
        "Simulator Detected",
        "Camera functionality is only available on physical devices."
      );
      return;
    }

    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) {
      console.log('No camera ref');
      return;
    }
    
    try {
      console.log('Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      if (photo?.uri) {
        console.log('Photo taken:', photo.uri);
        
        // setImage(photo.uri);
        // setScan(photo.uri);
        // setShowCamera(false);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const FaceGuideOverlay = () => (
    <View style={styles.faceGuideContainer}>
      <View style={styles.faceGuideCircle} />
      <Text style={styles.guideText}>Position your face within the circle</Text>
    </View>
  );

  return (
    <View style={[defaultStyles.onboardingContainer, {width: width}]}>
        <Text style={defaultStyles.onboardingTitle}>Let's scan your face</Text>
        <Text style={defaultStyles.onboardingCaption}>
            We'll let our AI model analyze your skin to provide personalized recommendations
        </Text>
        
        <View style={styles.scanContainer}>
            <TouchableOpacity 
                style={styles.scanButton} 
                onPress={startScan}
            >
                <Ionicons name="scan" size={50} color="black" />
                <Text style={styles.scanText}>Start Scan</Text>
            </TouchableOpacity>
        </View>
        
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <Modal
            animationType="slide"
            presentationStyle="fullScreen"
            visible={showCamera}
            onRequestClose={() => setShowCamera(false)}
        >
            <CameraView 
                ref={cameraRef as any}
                style={StyleSheet.absoluteFill}
                facing={facing}
                onMountError={(error) => console.error("Camera mount error:", error)}
                onCameraReady={handleCameraReady}
            >
                <TouchableOpacity 
                    style={styles.closeCamera}
                    onPress={() => {
                        setIsCameraReady(false);
                        setTimeout(() => {
                            setShowCamera(false);
                        }, 100);
                    }}
                >
                    <Ionicons name="close" size={40} color="white" />
                </TouchableOpacity>

                <FaceGuideOverlay />

                {isCameraReady && (
                    <TouchableOpacity 
                        style={styles.captureButton}
                        onPress={async () => {
                            if (!isCameraReady) return;
                            await handleCapture();
                            setIsCameraReady(false);
                            setTimeout(() => {
                                setShowCamera(false);
                            }, 100);
                        }}
                    >
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                )}
            </CameraView>
        </Modal>
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
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 70,
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    scanContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    scanText: {
        fontSize: 15,
        fontFamily: 'NunitoSans',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 20,
    },
    closeCamera: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
    },
    faceGuideContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceGuideCircle: {
        width: 300,
        height: 300,
        borderRadius: 125,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'transparent',
    },
    guideText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'NunitoSans',
    },
});