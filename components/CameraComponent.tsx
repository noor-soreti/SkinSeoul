import { CameraView, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

interface CameraComponentProps {
    isVisible: boolean;
    onClose: () => void;
    onImageCaptured: (imageUri: string, savedUri: string) => void;
    showFaceGuide?: boolean;
}

export default function CameraComponent({ 
    isVisible, 
    onClose, 
    onImageCaptured,
    showFaceGuide = false 
}: CameraComponentProps) {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

    const saveToGallery = async (uri: string) => {
        try {
            // Request permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to save photos to your gallery.');
                return null;
            }

            // Generate filename using timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `skincare_${timestamp}.jpg`;

            // Save the image
            const asset = await MediaLibrary.createAssetAsync(uri);
            
            // Show success message
            Alert.alert(
                'Success',
                'Photo saved to gallery successfully!',
                [{ text: 'OK' }]
            );

            return asset.uri;
        } catch (error) {
            console.error('Error saving photo:', error);
            Alert.alert('Error', 'Failed to save photo to gallery');
            return null;
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setCapturedImage(photo.uri);
                    
                    // Save to gallery and get saved URI
                    const savedUri = await saveToGallery(photo.uri);
                    if (savedUri) {
                        onImageCaptured(photo.uri, savedUri);
                    }
                }
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const FaceGuideOverlay = () => (
        <View style={styles.faceGuideContainer}>
            <View style={styles.faceGuideCircle} />
            <Text style={styles.guideText}>Position your face within the circle</Text>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            presentationStyle="fullScreen"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <CameraView 
                ref={cameraRef}
                style={StyleSheet.absoluteFill} 
                facing="front"
            >
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                
                {showFaceGuide && <FaceGuideOverlay />}
                
                <TouchableOpacity 
                    style={styles.captureButton}
                    onPress={takePicture}
                />
            </CameraView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
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
