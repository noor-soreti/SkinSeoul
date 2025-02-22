import { CameraView } from 'expo-camera';
import { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert, Platform, Image } from 'react-native';
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
    const [savedUri, setSavedUri] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Reset camera state when modal closes
    useEffect(() => {
        if (!isVisible) {
            setIsCameraReady(false);
            setCapturedImage(null);
            setSavedUri(null);
            setShowPreview(false);
        }
    }, [isVisible]);

    const onCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);

    const saveToGallery = async (uri: string) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to save photos to your gallery.');
                return null;
            }

            const asset = await MediaLibrary.createAssetAsync(uri);
            return asset.uri;
        } catch (error) {
            console.error('Error saving photo:', error);
            return null;
        }
    };

    const takePicture = async () => {
        if (!cameraRef.current || !isCameraReady) {
            console.log('Camera not ready');
            return;
        }

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                skipProcessing: Platform.OS === 'android',
            });

            if (photo) {
                const savedUri = await saveToGallery(photo.uri);
                setCapturedImage(photo.uri);
                setSavedUri(savedUri);
                setShowPreview(true);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const handleAccept = () => {
        if (capturedImage && savedUri) {
            onClose();
            // Notify parent after a short delay
            setTimeout(() => {
                onImageCaptured(capturedImage, savedUri);
            }, 100);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setSavedUri(null);
        setShowPreview(false);
    };

    return (
        <Modal
            animationType="none"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
            presentationStyle="fullScreen"
        >
            <View style={StyleSheet.absoluteFill}>
                {!showPreview ? (
                    <CameraView 
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill} 
                        facing="front"
                        onCameraReady={onCameraReady}
                        // enableHighQualityPhotos={false}
                    >
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={30} color="white" />
                        </TouchableOpacity>
                        
                        {showFaceGuide && (
                            <View style={styles.faceGuideContainer}>
                                <View style={styles.faceGuideCircle} />
                                <Text style={styles.guideText}>Position your face within the circle</Text>
                            </View>
                        )}
                        
                        <TouchableOpacity 
                            style={[
                                styles.captureButton,
                                !isCameraReady && styles.captureButtonDisabled
                            ]}
                            onPress={takePicture}
                            disabled={!isCameraReady}
                        />
                    </CameraView>
                ) : (
                    <View style={StyleSheet.absoluteFill}>
                        <Image 
                            source={{ uri: capturedImage! }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.previewButtons}>
                            <TouchableOpacity 
                                style={styles.previewButton} 
                                onPress={handleRetake}
                            >
                                <Text style={styles.previewButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.previewButton, styles.acceptButton]} 
                                onPress={handleAccept}
                            >
                                <Text style={[styles.previewButtonText, styles.acceptButtonText]}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
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
    captureButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    previewButtons: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    previewButton: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    previewButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'NunitoSans',
    },
    acceptButtonText: {
        fontWeight: 'bold',
    },
});
