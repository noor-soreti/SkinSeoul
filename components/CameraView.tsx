import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onClose: () => void;
    onCapture: (uri: string) => void;
}

const CustomCameraView = ({ onClose, onCapture }: Props) => {
    const cameraRef = useRef<ExpoCameraView>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    
    const handleCameraReady = useCallback(() => {
        console.log('Camera ready');
        setIsCameraReady(true);
    }, []);

    const handleCapture = useCallback(async () => {
        if (!cameraRef.current || !isCameraReady) {
            console.log('Camera not ready');
            return;
        }

        try {
            console.log('Taking picture...');
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: true,
            });

            if (photo?.uri) {
                console.log('Photo captured, calling onCapture');
                onCapture(photo.uri);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
    }, [isCameraReady, onCapture]);

    const FaceGuideOverlay = () => (
        <View style={styles.faceGuideContainer}>
            <View style={styles.faceGuideCircle} />
            <Text style={styles.guideText}>Position your face within the circle</Text>
        </View>
    );

    return (
        <ExpoCameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={CameraType.front}
            onMountError={(error) => console.error("Camera mount error:", error)}
            onCameraReady={handleCameraReady}
        >
            <TouchableOpacity
                style={styles.closeCamera}
                onPress={onClose}
            >
                <Ionicons name="close" size={40} color="white" />
            </TouchableOpacity>

            <FaceGuideOverlay />

            {isCameraReady && (
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={handleCapture}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            )}
        </ExpoCameraView>
    );
};

export default CustomCameraView;

const styles = StyleSheet.create({
    // Copy the relevant styles from OnboardingCard7
    closeCamera: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
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
    faceGuideContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceGuideCircle: {
        width: 300,
        height: 400,
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