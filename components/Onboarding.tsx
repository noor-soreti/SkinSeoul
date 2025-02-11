import { SafeAreaView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import OnboardingBackground from "./OnboardingBackground";
import Animated, { useAnimatedRef, useDerivedValue, useSharedValue, scrollTo } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import OnboardingCard1 from "./OnboardingCard1";
import OnboardingCard2 from "./OnboardingCard2";
import OnboardingCard3 from "./OnboardingCard3";
import OnboardingCard4 from "./OnboardingCard4";
import OnboardingCard5 from "./OnboardingCard5";
import OnboardingCard6 from "./OnboardingCard6";
// import OnboardingCard1 from "./OnboardingCard1";

type Props = {
    onClose: () => void
}

export default function Onboarding ({onClose}: Props) {
    const screenSize = useWindowDimensions();
    const animatedRef = useAnimatedRef<Animated.ScrollView>();
    const stepScroll = useSharedValue<number>(0)
    const [ step, setStep ] = useState(1)

    const STEP_COUNT = 10;
    const ITEM_SIZE = screenSize.width * 0.85;
    const ITEM_MARGIN = 20;

    // useDerivedValue(() => {
    //     scrollTo(animatedRef, stepScroll.value * (ITEM_SIZE + ITEM_MARGIN), 0, true);
    // });

    // useEffect(() => {
    //     const newStepValue = step -1
    //     stepScroll.value = newStepValue
    // }, [step])

    // function onNextPressed() {
    //     if (step == STEP_COUNT) {
    //         onClose ? onClose() : router.push("/(tabs)/home")
    //     } else {
    //         setStep(step + 1)
    //     }
    // }

    return(
        <SafeAreaView style={[defaultStyles.container, {flex: 1}]}>
            {/* <OnboardingCard1/> */}
            {/* <OnboardingCard2/> */}
            {/* <OnboardingCard3/> */}
            {/* <OnboardingCard4/> */}
            {/* <OnboardingCard5/> */}
            <OnboardingCard6/>
        </SafeAreaView>
    )
}