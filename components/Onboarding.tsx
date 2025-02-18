import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedRef, useDerivedValue, useSharedValue, scrollTo } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Entypo from '@expo/vector-icons/Entypo';
import OnboardingCard2 from "./OnboardingCard2";
import OnboardingCard6 from "./OnboardingCard6";
import { router } from "expo-router";
import OnboardingCard7 from "./OnboardingCard7";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingCard8 from "./OnboardingCard8";
import { getData, getObject, storeData, storeObject } from "@/storageHelper";

type Props = {
    onClose: () => void
}

export default function Onboarding ({onClose}: Props) {
    const screenSize = useWindowDimensions();
    const animatedRef = useAnimatedRef<Animated.ScrollView>();
    const stepScroll = useSharedValue<number>(1)
    const [ step, setStep ] = useState(1)

    const [ disableButton, setDisableButton ] = useState(true);

    const [ age, setAge ] = useState<string | null>(null)
    const [ goals, setGoals ] = useState<Array<string>>([])
    const [ scan, setScan ] = useState<string | null>(null)
    const [ skincareRoutine, setSkincareRoutine ] = useState<any | null>([])

    const STEP_COUNT = 4;
    const ITEM_SIZE = screenSize.width;

    useDerivedValue(() => {
        scrollTo(animatedRef, stepScroll.value * (ITEM_SIZE ), 0, true);
    });

    useEffect(() => {
        // triggers whenever age is updated
        console.log('age:', age);
        if (age) {
            (async () => {
                await storeData("age", age);
            })();
        }
    }, [age]);    
    
    useEffect(() => {
        // triggers whenever goals is updated
        if (goals) {
            (async () => {
                await storeData("goals", JSON.stringify(goals));
            })();
        }
    }, [goals]);

    useEffect(() => {
        // triggers whenever scan is updated
        console.log('scan:', scan);
        if (scan) {
            (async () => {
                await storeData("scan", scan);
            })();
        }
    }, [scan]);

    useEffect(() => {
        // triggers whenever skincareRoutine is updated
        if (skincareRoutine) {
            (async () => {
                // console.log('skincareRoutine:', skincareRoutine);
                storeObject("skincareRoutine", skincareRoutine);
            })();
        }
    }, [skincareRoutine])

    const getAgeFromAsyncStorage = async () => {
        const getAge = await getData('age');
        
        if (getAge) {
            console.log('asyncAge:', getAge);
            setAge(getAge);
            setDisableButton(false);
        }
    }

    const getGoalsFromAsyncStorage = async () => {
        const getGoals = await getObject('goals');                
        
        if (getGoals && getGoals.length > 0) {
            console.log('asyncGoals:', getGoals);
            setDisableButton(false);
            setGoals(JSON.parse(getGoals));
        } 
    }

    const getScanFromAsyncStorage = async () => {
        const getScan = await getData('scan');   

        if (getScan) {
            console.log('asyncScan:', getScan);
            setScan(getScan);
            setDisableButton(false);
        }
    }

    const getSkincareRoutineFromAsyncStorage = async () => {
        const getSkincareRoutine = await getObject('skincareRoutine');
        if (getSkincareRoutine != null) {
            console.log('asyncSkincareRoutine:', getSkincareRoutine);
            if (getSkincareRoutine) {
                setSkincareRoutine(getSkincareRoutine);
                setDisableButton(false);
            }
        }
    }

    useEffect(() => {    
        switch (step) {
            case 1:
                getAgeFromAsyncStorage();
                break;
            case 2: 
                getGoalsFromAsyncStorage();
                break;
            case 3:             
                getScanFromAsyncStorage();
                break;
            case 4:
                getSkincareRoutineFromAsyncStorage();
                break;
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
                }}
                horizontal
                scrollEnabled={false}
            >
                <OnboardingCard2 width={ITEM_SIZE} isActive={step === 1} setDisableButton={setDisableButton} setAge={setAge} age={age} />
                <OnboardingCard6 width={ITEM_SIZE} isActive={step === 2} setDisableButton={setDisableButton} setGoals={setGoals} goals={goals} />
                <OnboardingCard7 width={ITEM_SIZE} isActive={step === 3} setDisableButton={setDisableButton} setScan={setScan} />
                <OnboardingCard8 width={ITEM_SIZE} step={step === 4} setSkincareRoutine={setSkincareRoutine} skincareRoutine={skincareRoutine} />
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