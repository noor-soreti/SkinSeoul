import { defaultStyles } from "@/constants/Styles"
import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from "react-native"
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import CameraComponent from './CameraComponent';

const OnboardingCard7 = ({width, setScan}: any) => {
    const [image, setImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

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
            if (!granted) return;
        }
        setShowCamera(true);
    };

    const handleImageCaptured = (imageUri: string, savedUri: string) => {
        setImage(imageUri);
        setScan(imageUri);
        setShowCamera(false);
    };

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

            <CameraComponent 
                isVisible={showCamera}
                onClose={() => setShowCamera(false)}
                onImageCaptured={handleImageCaptured}
                showFaceGuide={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default OnboardingCard7;