import { defaultStyles } from "@/constants/Styles";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOALS = [
    { title: "Achieve glowing, radiant skin ✨" },
    { title: "Reduce acne breakouts 🔴" },
    { title: "Minimize acne scars & dark spots 🧼" },
    { title: "Control oily skin & shine 🌟" },
    { title: "Hydrate skin 💦" },
    { title: "Strengthen skin barrier 🛡️" },
    { title: "Reduce flaky, rough skin 🧴" },
    { title: "Prevent fine lines & wrinkles ⏳" },
    { title: "Improve skin elasticity & firmness 💪" },
    { title: "Reduce dark circles & puffiness around the eyes 👀" },
    { title: "Even out skin tone & reduce hyperpigmentation 🎨" },
    { title: "Minimize large pores 🔬" },
    { title: "Smooth rough texture 🪄" },
    { title: "Reduce redness and inflamation 🌿" },
    { title: "Practice facial yoga (coming soon) 🧘‍♂️" },
]

const OnboardingCard6 = () => {
    const viewRef = useRef(null);
    const buttonRef = useRef(null);
    const [ viewHeight, setViewHeight ] = useState(0)
    const [ buttonHeight, setButtonHeight ] = useState(0);
    
    return (
        <View style={defaultStyles.onboardingContainer} >
            <Text style={defaultStyles.onboardingTitle} >What are your goals?</Text>
            <Text style={defaultStyles.onboardingCaption}>Choose as many as you want. This will help personalize products to your goals.</Text>

            <View ref={viewRef} style={{flex: 1}} onLayout={(e) => setViewHeight(e.nativeEvent.layout.height) }>
                <FlatList 
                    data={GOALS}
                    renderItem={({ item }) => 
                    <TouchableOpacity style={styles.selector}>
                        <Text>{item.title}</Text>
                    </TouchableOpacity>}
                    // estimatedItemSize={20}
                    style={{maxHeight: viewHeight - buttonHeight - 15 }}
                />
            </View>
            
            <TouchableOpacity ref={buttonRef} style={defaultStyles.onboardingButton} onLayout={(e) => setButtonHeight(e.nativeEvent.layout.height)}>
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
        fontFamily: 'Inter',
        fontSize: 15,
    },
    selector: {
        width: '100%',
        backgroundColor: '#E1DFDF',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
        
    },
    flashList: {
        width: '90%'
    }
})

export default OnboardingCard6