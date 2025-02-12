import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from 'expo-image';

const OnboardingCard4 = ({width, isActive}: any) => {    
    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]}>
            <Text style={defaultStyles.onboardingTitle} >Tell us about your skin</Text>

            <Text style={defaultStyles.onboardingSubTitle}>
                What's your Skin Tone?
            </Text>

            <View style={defaultStyles.imageContainer}>
                
                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("EEDCCE")}>
                    <View style={[defaultStyles.imageEllipse, {backgroundColor: '#EEDCCE'}]}/>
                    <Text style={defaultStyles.imageText}>Light</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("EFCDB4")}>
                    <View style={[defaultStyles.imageEllipse, {backgroundColor: '#EFCDB4'}]}/>
                    <Text style={defaultStyles.imageText}>Medium</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("EDC09F")}>
                    <View style={[defaultStyles.imageEllipse, {backgroundColor: '#EDC09F'}]}/>
                    <Text style={defaultStyles.imageText}>Medium Light</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("E0B08C")}>
                    <View style={[defaultStyles.imageEllipse, {backgroundColor: '#E0B08C'}]}/>
                    <Text style={defaultStyles.imageText}>Medium Dark</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("CE9C77")}>
                    <View style={[defaultStyles.imageEllipse, {backgroundColor: '#CE9C77'}]}/>
                    <Text style={defaultStyles.imageText}>Dark</Text>
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

export default OnboardingCard4