import Onboarding from "@/components/Onboarding"
import { defaultStyles } from "@/constants/Styles"
import { getData } from "@/storageHelper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Calendar from '@/components/Calendar'
import ScanButton from '@/components/ScanButton'
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'

const IS_ONBOARDED = "IS_ONBOARDED"

const HomeScreen = () => {
    const [ showOnboarding, setShowOnboarding ] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCamera, setShowCamera] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()
    
    useEffect(() => {
        async function checkFirstLaunch() {
            const firstLaunch = await AsyncStorage.getItem(IS_ONBOARDED);
            if (!firstLaunch) {
                setShowOnboarding(true);
                console.log("FIRST LAUNCH");
            }
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

    return (
        <View style={defaultStyles.screenContainer}>
            
            <View style={defaultStyles.topContainer}>
                <View style={styles.titleContainer}>
                    <Text style={defaultStyles.screenTitle} >Your Daily Skincare Routine</Text>
                    <ScanButton onPressScan={handleScan} />
                </View>

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

            <Modal
                animationType="slide"
                presentationStyle="fullScreen"
                visible={showCamera}
                onRequestClose={() => setShowCamera(false)}
            >
                <CameraView style={StyleSheet.absoluteFill} >
                    <TouchableOpacity 
                        style={styles.closeCamera}
                        onPress={() => setShowCamera(false)}
                    >
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                </CameraView>
            </Modal>
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
        // justifyContent: 'space-between',
    },
    closeCamera: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
})