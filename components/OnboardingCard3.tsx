import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from 'expo-image';

const OnboardingCard3 = () => {    
    return (
        <View style={defaultStyles.onboardingContainer}>
            <Text style={defaultStyles.onboardingTitle} >Tell us about your skin</Text>

            <Text style={defaultStyles.onboardingSubTitle}>
                What's your Skin Type?
            </Text>

            <View style={defaultStyles.imageContainer}>
                
                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("DRY")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinType/Dry.png")}
                    />
                    <Text style={defaultStyles.imageText}>Dry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("NORMAL")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinType/Normal.png")}
                    />
                    <Text style={defaultStyles.imageText}>Normal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("OILY")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinType/Oily.png")}
                    />
                    <Text style={defaultStyles.imageText}>Oily</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("COMBINATION")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinType/Combination.png")}
                    />
                    <Text style={defaultStyles.imageText}>Combination</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinType/Acne Prone.png")}
                    />
                    <Text style={defaultStyles.imageText}>Acne Prone</Text>
                </TouchableOpacity>

            </View>

        
            <TouchableOpacity style={defaultStyles.onboardingButton}>
                <Text style={defaultStyles.onboardingButtonText} >Continue</Text>
            </TouchableOpacity>
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

export default OnboardingCard3