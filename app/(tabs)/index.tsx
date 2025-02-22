import Onboarding from "@/components/Onboarding"
import { defaultStyles } from "@/constants/Styles"
import { getData, getObject } from "@/storageHelper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState, useRef } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Calendar from '@/components/Calendar'
import ScanButton from '@/components/ScanButton'
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import LinearGradientSection from "@/components/LinearGradientSection"
import CameraComponent from '@/components/CameraComponent'

const IS_ONBOARDED = "IS_ONBOARDED"

const HomeScreen = () => {
    const [ showOnboarding, setShowOnboarding ] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCamera, setShowCamera] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()
    const textRef = useRef<Text>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    
    useEffect(() => {
        async function checkFirstLaunch() {
            await AsyncStorage.clear()
            // await AsyncStorage.setItem(IS_ONBOARDED, 'true')
            const firstLaunch = await AsyncStorage.getItem(IS_ONBOARDED);
            if (!firstLaunch) {
                setShowOnboarding(true);
                console.log("FIRST LAUNCH");
            }
            const skincareRoutine = await getObject('skincareRoutine');
            console.log('skincareRoutine', skincareRoutine);
        }
        checkFirstLaunch()
    }, [])

    useEffect(() => {
        async function getSkincareItems() {
            const skincareItem = await getData('skincareRoutine')
            console.log(skincareItem);
            
        }
        getSkincareItems();
    }, [])

    async function onFirstLaunchClosed() {
        await AsyncStorage.setItem(IS_ONBOARDED, 'true')
        setShowOnboarding(false)
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        // Here you can add logic to fetch products for the selected date
    };

    const handleScan = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) return;
        }
        setShowCamera(true);
    };

    const handleImageCaptured = (imageUri: string, savedUri: string) => {
        setCapturedImage(imageUri);
        console.log('Photo captured:', imageUri);
        console.log('Photo saved to:', savedUri);
        setShowCamera(false);
    };

    return (
        <View style={defaultStyles.screenContainer}>
            <LinearGradientSection>
            <View style={[defaultStyles.topContainer, styles.topContainerAdjust]}>
                <View style={styles.titleContainer}>
                    <Text ref={textRef} style={defaultStyles.screenTitle}>Your Daily Skincare Routine</Text>
                    <ScanButton onPressScan={handleScan} />
                </View>                
            </View>
            </LinearGradientSection>

            <View style={styles.calendarWrapper}>
                <Calendar onDateSelect={handleDateSelect} />
            </View>

            <View style={{padding: '5%'}}>
                <TouchableOpacity style={styles.productItem}>
                    {/* <View style={styles.productItem}> */}
                        <Text>Product Name</Text>
                        <Text style={styles.step} >Step 1</Text>
                        
                    {/* </View> */}
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                presentationStyle="fullScreen"
                visible={showOnboarding}
                onRequestClose={() => setShowOnboarding(false)}
            >
                <Onboarding onClose={onFirstLaunchClosed} />
            </Modal>

            <CameraComponent 
                isVisible={showCamera}
                onClose={() => setShowCamera(false)}
                onImageCaptured={handleImageCaptured}
            />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    productItem: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        
    },
    step: {
        borderColor: '#758599',
        borderWidth: 1,
        padding: 4,
        textAlign: 'center',
        borderRadius: 15,
        color: '#758599'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    closeCamera: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    topContainerAdjust: {
        paddingBottom: 60,
    },
    calendarWrapper: {
        marginHorizontal: 25,
        borderRadius: 18,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -90,
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
})