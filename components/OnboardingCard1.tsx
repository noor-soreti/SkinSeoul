import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingCard1 = ({width, setGender, gender}: any) => {

    const handleSetGender = (select: string) => {
        console.log('select:', select);
        setGender(select);
    }

    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]}>
            <Text style={defaultStyles.onboardingTitle} >What's your gender?</Text>
            <Text style={defaultStyles.onboardingCaption}>This will help us adjust your routine steps based on your gender</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity  style={[styles.button, gender == 'female' && defaultStyles.selectedImage ]} onPress={() => handleSetGender("female")}>
                    <Ionicons name="female-outline" size={50} color="white" />
                    <Text style={styles.text} >Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, gender == 'male' && defaultStyles.selectedImage ]} onPress={() => handleSetGender("male")}>
                    <Ionicons name="male-outline" size={50} color="white" />
                    <Text style={styles.text} >Male</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        width: '90%',
        justifyContent: 'space-evenly'
    },
    button: {
        backgroundColor: '#ED6672',
        height: 100,
        width: 100,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#FFFFFF",
        fontFamily: 'Roboto',
        fontSize: 13,
    }
})

export default OnboardingCard1