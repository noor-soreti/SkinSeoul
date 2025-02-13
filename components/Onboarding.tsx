import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import OnboardingBackground from "./OnboardingBackground";
import Animated, { useAnimatedRef, useDerivedValue, useSharedValue, scrollTo } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Entypo from '@expo/vector-icons/Entypo';
import OnboardingCard1 from "./OnboardingCard1";
import OnboardingCard2 from "./OnboardingCard2";
import OnboardingCard3 from "./OnboardingCard3";
import OnboardingCard4 from "./OnboardingCard4";
import OnboardingCard5 from "./OnboardingCard5";
import OnboardingCard6 from "./OnboardingCard6";
import { router } from "expo-router";
import OnboardingCard7 from "./OnboardingCard7";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingCard8 from "./OnboardingCard8";

type Props = {
    onClose: () => void
}

export default function Onboarding ({onClose}: Props) {
    const screenSize = useWindowDimensions();
    const animatedRef = useAnimatedRef<Animated.ScrollView>();
    const stepScroll = useSharedValue<number>(1)
    const [ step, setStep ] = useState(1)

    const [ disableButton, setDisableButton ] = useState(true);

    const [ gender, setGender ] = useState<string | null>(null)
    const [ age, setAge ] = useState<string | null>(null)
    const [ goals, setGoals ] = useState<Array<string> | null>([])
    const [ scan, setScan ] = useState<string | null>(null)

    const STEP_COUNT = 5;
    const ITEM_SIZE = screenSize.width;

    useDerivedValue(() => {
        scrollTo(animatedRef, stepScroll.value * (ITEM_SIZE ), 0, true);
    });

    useEffect(() => {
        // triggers whenever gender is updated
        if (gender) {
            (async () => {
                await AsyncStorage.setItem("gender", gender);
            })();
        }
    }, [gender]);

    useEffect(() => {
        // triggers whenever age is updated
        console.log('age:', age);
        if (age) {
            (async () => {
                await AsyncStorage.setItem("age", age);
            })();
        }
    }, [age]);    
    
    useEffect(() => {
        // triggers whenever goals is updated
        console.log('goals:', goals);
        if (goals) {
            (async () => {
                await AsyncStorage.setItem("goals", JSON.stringify(goals));
            })();
        }
    }, [goals]);

    useEffect(() => {
        // triggers whenever scan is updated
        console.log('scan:', scan);
        if (scan) {
            (async () => {
                await AsyncStorage.setItem("scan", scan);
            })();
        }
    }, [scan]);

    const getGenderFromAsyncStorage = async () => {        
        const getGender = await AsyncStorage.getItem('gender');
        console.log(getGender);
        if (getGender) {
            setGender(getGender);
            setDisableButton(false);
        }
    }

    const getAgeFromAsyncStorage = async () => {
        const getAge = await AsyncStorage.getItem('age');
        console.log(getAge);
        if (getAge) {
            setAge(getAge);
            setDisableButton(false);
        }
    }

    const getGoalsFromAsyncStorage = async () => {
        const getGoals = await AsyncStorage.getItem('goals');
        console.log(getGoals);
        if (getGoals) {
            setGoals(JSON.parse(getGoals));
            setDisableButton(false);
        }
    }

    const getScanFromAsyncStorage = async () => {
        const getScan = await AsyncStorage.getItem('scan');
        console.log(getScan);
        if (getScan) {
            setScan(getScan);
            setDisableButton(false);
        }
    }

    useEffect(() => {    
        switch (step) {
            case 1:
                getGenderFromAsyncStorage();
                break;
            case 2:
                getAgeFromAsyncStorage();
            case 3: 
                getGoalsFromAsyncStorage();
            case 4: 
                getScanFromAsyncStorage();
            default:
                break;
        }
        const newStepValue = step - 1
        stepScroll.value = newStepValue        
    }, [step])

    function onNextPressed() {
        if (step == STEP_COUNT) {
            onClose ? onClose() : router.push("/(tabs)")
        } else {
            setDisableButton(true)
            setStep(step + 1)
        }
    }

    function onBackPressed () {
        setStep(step - 1)
    }

    return(
        <SafeAreaView style={[defaultStyles.container, {flex: 1}]}>
            
            {
                step != 1 &&
                <TouchableOpacity style={styles.chevronBack} onPress={onBackPressed} >
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
            }


            <Animated.ScrollView
                ref={animatedRef}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    // paddingVertical: 20
                }}
                horizontal
                scrollEnabled={false}
            >

                <OnboardingCard1 width={ITEM_SIZE} isActive={step === 1} setDisableButton={setDisableButton} setGender={setGender} gender={gender} />
                <OnboardingCard2 width={ITEM_SIZE} isActive={step === 2} setDisableButton={setDisableButton} setAge={setAge} age={age} />
                {/* <OnboardingCard3 width={ITEM_SIZE} isActive={step === 3} setDisableButton={setDisableButton} /> */}
                {/* <OnboardingCard4 width={ITEM_SIZE} isActive={step === 4} /> */}
                {/* <OnboardingCard5 width={ITEM_SIZE} isActive={step === 5} /> */}
                <OnboardingCard6 width={ITEM_SIZE} isActive={step === 3} setDisableButton={setDisableButton} setGoals={setGoals} />
                <OnboardingCard7 width={ITEM_SIZE} isActive={step === 4} setDisableButton={setDisableButton} setScan={setScan} />
                <OnboardingCard8 width={ITEM_SIZE} isActive={step === 4} setDisableButton={setDisableButton} setScan={setScan} />
            </Animated.ScrollView>

            <TouchableOpacity style={[defaultStyles.onboardingButton, disableButton && defaultStyles.disableOnboardingButton ]} onPress={onNextPressed} disabled={disableButton} >
                <Text style={defaultStyles.onboardingButtonText} >Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chevronBack: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#D8DADC',
        borderRadius: 10,
        padding: 5,
    }
})