import { defaultStyles } from "@/constants/Styles"
import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native"
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import CameraComponent from './CameraComponent';

interface OnboardingCard7Props {
    width: number;
    setScan: (uri: string) => void;
    isActive: boolean;
    setDisableButton: (disableButton: boolean) => void;
}

const OnboardingCard7 = ({ width, setScan, isActive, setDisableButton }: OnboardingCard7Props) => {
    const [image, setImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (!isActive && showCamera) {
            setShowCamera(false);
        }
    }, [isActive]);

    const isSimulator = Device.isDevice === false;

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
            if (!granted) {
                Alert.alert("Permission Required", "Camera access is needed to scan your face.");
                return;
            }
        }
        setShowCamera(true);
    };

    const handleImageCaptured = (imageUri: string, savedUri: string) => {
        try {
            setImage(imageUri);
            setScan(imageUri);
            setTimeout(() => {
                setShowCamera(false);
            }, 100);
            setDisableButton(false);
        } catch (error) {
            console.error('Error handling captured image:', error);
            Alert.alert('Error', 'Failed to process captured image');
        }
    };

    if (!isActive && showCamera) {
        setShowCamera(false);
    }

    return (
        <View style={[defaultStyles.onboardingContainer, {width}]}>
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
                    <Text style={styles.scanText}> {image ? "Retake" : "Start"} Scan</Text>
                </TouchableOpacity>
            </View>
            
            {image && (
                <View style={styles.previewContainer}>
                    <Image 
                        source={{ uri: image }} 
                        style={styles.previewImage}
                        contentFit="cover"
                    />
                </View>
            )}

            {isActive && (
                <CameraComponent 
                    isVisible={showCamera}
                    onClose={() => setShowCamera(false)}
                    onImageCaptured={handleImageCaptured}
                    showFaceGuide={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scanContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '30%',
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
    previewContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});

export default OnboardingCard7;