import React from "react";
import { defaultStyles } from "@/constants/Styles";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
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
import { storeRoutine, getRoutineSteps } from '@/utils/database';

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
            const routineData = await generateSkincareRoutine();
            await storeRoutine(routineData);

            // Get the stored routine from database
            const morningSteps = await getRoutineSteps('morning');
            const eveningSteps = await getRoutineSteps('evening');
            
            // Update the UI with database data
            setSkincareRoutine({
                morning_routine: morningSteps.map(step => ({
                    step: step.product_type,
                    product: step.product_name
                })),
                evening_routine: eveningSteps.map(step => ({
                    step: step.product_type,
                    product: step.product_name
                }))
            });

            Alert.alert('Success', 'Your skincare routine has been generated and saved!');
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
            <Text style={defaultStyles.onboardingTitle}>Finished!</Text>
            <Text style={defaultStyles.onboardingCaption}>
                View your AI generated skincare routine below
            </Text>

            <TouchableOpacity onPress={handlePress}>
                <Text>Generate Routine</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.routineScrollContainer} contentContainerStyle={styles.routineContentContainer}>
                <View style={styles.routineContainer}>
                    <Text style={styles.routineTitle}>Morning Routine ☀️</Text>
                    <FlatList
                        scrollEnabled={false}
                        data={skincareRoutine?.morning_routine || []}
                        renderItem={({item}) => (
                            <View style={styles.routineItem}>
                                <Text style={styles.stepText}>{item.step}</Text>
                                <Text style={styles.productText}>{item.product}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.step}
                    />

                    <Text style={[styles.routineTitle,]}>Evening Routine 🌙</Text>
                    <FlatList
                        scrollEnabled={false}
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
            </ScrollView>
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
    routineScrollContainer: {
        flex: 1,
        width: '100%',
    },
    routineContentContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    routineContainer: {
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
    morningRoutine: {
        backgroundColor: '#ED6672',
    },
    stepText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    productText: {
        fontSize: 16,
        flex: 2,
        textAlign: 'right',
    }
})

export default OnboardingCard8