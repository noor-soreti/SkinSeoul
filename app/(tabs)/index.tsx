import DashboardBackground from "@/components/DahboardBackground"
import Onboarding from "@/components/Onboarding"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Modal, SafeAreaView, Text, View } from "react-native"

const IS_ONBOARDED = "IS_ONBOARDED"

const HomeScreen = () => {
    const [ showOnboarding, setShowOnboarding ] = useState(false)
    
    useEffect(() => {
        async function checkFirstLaunch() {
            // await AsyncStorage.setItem(IS_ONBOARDED, '')
            const firstLaunch = await AsyncStorage.getItem(IS_ONBOARDED);
            if (!firstLaunch) {
                setShowOnboarding(true);
                console.log("FIRST LAUNCH");
            }
        }
        checkFirstLaunch()
    }, [])

    async function onFirstLaunchClosed() {
        await AsyncStorage.setItem(IS_ONBOARDED, 'true')
        setShowOnboarding(false)
    }

    return (
        <View>
            <Text>HOME SCREEN</Text>
            <Modal
                animationType="slide"
                presentationStyle="fullScreen"
                visible={showOnboarding}
                onRequestClose={() => setShowOnboarding(false)}
            >
                <Onboarding onClose={onFirstLaunchClosed} />
            </Modal>
        </View>
    )
}

export default HomeScreen