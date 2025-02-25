import { defaultStyles } from "@/constants/Styles";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getData } from "@/utils/storageHelper";
import { SKIN_GOALS } from '../constants/SkinGoals';

interface OnboardingCard6Props {
    width: number;
    isActive: boolean;
    setGoals: (goals: string[]) => void;
    goals: string[];
    setDisableButton: (disableButton: boolean) => void;
}

const OnboardingCard6 = ({width, isActive, setGoals, goals, setDisableButton}: OnboardingCard6Props) => {
    const viewRef = useRef(null);
    const [ viewHeight, setViewHeight ] = useState(0)

    useEffect(() => {
        if (goals.length > 0) {
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }, [goals])

    useEffect(() => {
        if (isActive) {
            const test = async () => {
                console.log(await getData('goals'));
                console.log('goloa', goals);
            }
            test();
        }
    }, [isActive])

    const handleSelectedGoal = (goal: string) => {
        if (goals.includes(goal)) {
            setGoals(goals.filter(g => g !== goal));
        } else {
            if (goals.length >= 5) return;
            setGoals([...goals, goal]);
        }

        // setGoals((prevGoals: string[]) => {
        //     if (prevGoals.includes(goal)) {
        //         const newGoals = prevGoals.filter(g => g !== goal);
        //         setGoals(prevGoals.filter(g => g !== goal))
        //         return newGoals;
        //     } else {
        //         if (prevGoals.length >= 5) return prevGoals;
        //         const newGoals = [...prevGoals, goal];
        //         setGoals(newGoals);
        //         return newGoals;
        //     }
        // });
    };

    // useEffect(() => {
    //     if (isActive) {
    //         setDisableButton(goals.length === 0);
    //     }
    // }, [goals, isActive]);

    const renderGoalItem = ({ item }: { item: { title: string, emoji: string } }) => (
        <TouchableOpacity
            style={[
                styles.selector,
                { backgroundColor: goals.includes(item.title) ? '#FF909A' : '#E1DFDF' }
            ]}
            onPress={() => handleSelectedGoal(item.title)}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>{item.title}  </Text>
                <Text>{item.emoji}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]} >
            <Text style={defaultStyles.onboardingTitle} >What are your skin goals?</Text>
            <Text style={defaultStyles.onboardingCaption}>Choose up to 5 options. This will help personalize products to your goals.</Text>

            <View ref={viewRef} style={{flex: 1}} onLayout={(e) => setViewHeight(e.nativeEvent.layout.height) }>
                <FlatList 
                    data={SKIN_GOALS}
                    renderItem={renderGoalItem}
                    keyExtractor={item => item.title}
                    style={{maxHeight: viewHeight - 15 }}
                />
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
        fontFamily: 'Inter',
        fontSize: 15,
    },
    selector: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
    },
    goalsList: {
        width: '100%',
        flex: 1,
    }
})

export default OnboardingCard6