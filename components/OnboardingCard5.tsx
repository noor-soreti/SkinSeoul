import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from 'expo-image';

const OnboardingCard5 = () => {    
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
                        source={require("@/assets/images/skinConcern/Acne Scars.png")}
                    />
                    <Text style={defaultStyles.imageText}>Acne Scars</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("NORMAL")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Blackheads.png")}
                    />
                    <Text style={defaultStyles.imageText}>Black/White Heads</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("OILY")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Dark Undereyes.png")}
                    />
                    <Text style={defaultStyles.imageText}>Dark Undereyes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("COMBINATION")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Dullness.png")}
                    />
                    <Text style={defaultStyles.imageText}>Dullness</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/HyperPigmentation.png")}
                    />
                    <Text style={defaultStyles.imageText}>Hyper-Pigmentation</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Roughness.png")}
                    />
                    <Text style={defaultStyles.imageText}>Roughness</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Large Pores.png")}
                    />
                    <Text style={defaultStyles.imageText}>Large Pores</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Sensitivity.png")}
                    />
                    <Text style={defaultStyles.imageText}>Sensitivity</Text>
                </TouchableOpacity>

                <TouchableOpacity style={defaultStyles.imageSelector} onPress={() => console.log("ACNE PRONE")}>
                    <Image
                        style={defaultStyles.imageEllipse}
                        source={require("@/assets/images/skinConcern/Wrinkles.png")}
                    />
                    <Text style={defaultStyles.imageText}>Wrinkles</Text>
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

export default OnboardingCard5