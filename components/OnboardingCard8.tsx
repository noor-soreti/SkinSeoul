import React from "react";
import { defaultStyles } from "@/constants/Styles";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResponseFormat } from "openai/helpers/zod";
import { set, z } from "zod";
import RoutineView from "./RoutineView";
import { Image } from "expo-image";
import { supabase } from '@/utils/supabase'
import { getData } from '@/utils/storageHelper';
import { generateSkincareRoutine } from '@/utils/aiService';

const OnboardingCard8 = ({width, isActive, setDisableButton, setSkincareRoutine, skincareRoutine}: any) => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ aiResponse, setAiResponse ] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isActive) {
            if (skincareRoutine.length === 0) {
                setDisableButton(true);
            } else {
                setDisableButton(false);
            }
            setIsLoading(false);
        //   const fetchRoutine = async () => {
        //     const userData = {
        //         age: await AsyncStorage.getItem("age"),
        //         goals: await AsyncStorage.getItem("goals"),
        //     }
        //     await openAICall(userData);
        //   }
        //   fetchRoutine();
        }
    }, [isActive])      

    // const openAICall = async (userData: { age: any; goals: any}) => {
    //     try {
    //         // Call the Supabase Edge Function
    //         const response = await supabase.functions.invoke('openai', {
    //             body: { userData },
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
            
    //         console.log('Full response:', response);  // Log the full response
    //         console.log('Data:', response.data);      // Log just the data
            
    //         if (!response.data) {
    //             throw new Error('No data received from edge function');
    //         }
            
    //         // setSkincareRoutine(data);
    //         setAiResponse(response.data.message);
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.error("Error:", error);
    //         Alert.alert("Error calling AI service. Please try again.");
    //         setIsLoading(false);
    //     }
    // }

    const handlePress = async () => {
        setLoading(true);
        try {
            const response = await generateSkincareRoutine();
            setSkincareRoutine(response);
            console.log('Response:', response);
            Alert.alert('Success', response);
        } catch (error: any) {
            console.error('Error:', error);
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) {
        return (
            <View style={[defaultStyles.onboardingContainer, {width: width}]}>
                <Text style={defaultStyles.onboardingTitle} >Generating your ideal korean skincare routine—just a moment!</Text>
                {/* Activity indicator */}
                <ActivityIndicator style={{flex: 1}} size="large" color="#ED6672" />
            </View>
        )
    }

    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]}>
            <Text style={defaultStyles.onboardingTitle} >Finished!</Text>
            <Text style={defaultStyles.onboardingCaption}>
                We'll let our AI model analyze your skin to provide personalized recommendations
            </Text>

            <TouchableOpacity onPress={handlePress}>
                <Text>Generate Routine</Text>
            </TouchableOpacity>
            
            <View style={styles.routineContainer}>
                <Text style={styles.routineTitle}>Morning Routine</Text>
                <FlatList
                    data={skincareRoutine?.morning_routine || []}
                    renderItem={({item}) => (
                        <View style={styles.routineItem}>
                            <Image source={require('@/assets/images/routineIcons/cleanser.png')} style={{width: 50, height: 50}} />
                            <Text style={styles.productText}>{item.product}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.step}
                />

                <Text style={styles.routineTitle}>Evening Routine</Text>
                <FlatList
                    data={skincareRoutine?.evening_routine || []}
                    renderItem={({item}) => (
                      <View style={styles.routineItem}>
                        <Text style={styles.stepText}>{item.step}</Text>
                        <Text style={styles.productText}>{item.product}</Text>
                      </View>
                    )}
                    keyExtractor={(item) => item.step}
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
        color: "#FFFFFF",
        fontFamily: 'Roboto',
        fontSize: 13,
    },
    routineContainer: {
        flex: 1,
        padding: 20,
    },
    routineTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    routineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#D8DADC',
        borderRadius: 10,
        marginBottom: 10,
    },
    stepText: {
        fontSize: 16,
    },
    productText: {
        fontSize: 16,
        flexWrap: 'wrap',
    }
})

export default OnboardingCard8