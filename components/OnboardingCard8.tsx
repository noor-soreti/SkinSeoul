import React from "react";
import { defaultStyles } from "@/constants/Styles";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResponseFormat } from "openai/helpers/zod";
import { set, z } from "zod";
import RoutineView from "./RoutineView";

const OnboardingCard8 = ({width, step, setSkincareRoutine, skincareRoutine}: any) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        if (step) {
          const test = async () => {
            try {
              const routine = await AsyncStorage.getItem("skincareRoutine");
              console.log('routine', routine);
              
            } catch (error) {
              console.error("Error fetching OpenAI API:", error);
              setIsLoading(false); // Ensure loading state is updated even in case of an error
            }
          }
          test();
          const fetchRoutine = async () => {
            const userData = {
                age: await AsyncStorage.getItem("age"),
                gender: await AsyncStorage.getItem("gender"),
                goals: await AsyncStorage.getItem("goals"),
            }
            await openAICall(userData);
          }
          fetchRoutine();
        }
    }, [step])

    const RoutineEvent = z.object({
        morning_routine: z.array(
          z.object({ step: z.literal("Cleanser"), product: z.string() })
            .or(z.object({ step: z.literal("Toner"), product: z.string() }))
            .or(z.object({ step: z.literal("Essence"), product: z.string() }))
            .or(z.object({ step: z.literal("Moisturizer"), product: z.string() }))
            .or(z.object({ step: z.literal("Sunscreen"), product: z.string() }))
        ),
        evening_routine: z.array(
          z.object({ step: z.literal("Double Cleanse"), product: z.string() })
            .or(z.object({ step: z.literal("Cleanser"), product: z.string() }))
            .or(z.object({ step: z.literal("Toner"), product: z.string() }))
            .or(z.object({ step: z.literal("Essence"), product: z.string() }))
            .or(z.object({ step: z.literal("Moisturizer"), product: z.string() }))
        )
      });
      

    const openAICall = async (userData: { age: any; gender: any; goals: any}) => {
        try {
            const openai = new OpenAI({
                apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY
              });
              
              const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: zodResponseFormat(RoutineEvent, 'event'),
                messages: [
                    {
                        role: "system",
                        content: `You are a Korean skincare expert.Analyze the user's skin from the provided image and identify any visible issues such as acne, hyperpigmentation, redness, and wrinkles.
                                    Then, recommend a skincare routine using only Korean skincare products from these brands:
                                    - Laneige
                                    - Innisfree
                                    - Etude House
                                    - Missha
                                    - Some By Mi
                                    - Dr. Jart+
                                    - Beauty of Joseon
                                    - Pyunkang Yul
                                    - Mediheal
                                    - Isntree
                                    - Klairs
                                    - Neogen
                                    - ROUND LAB
                                    - Sulwhasoo
                                    - The History of Whoo
                                    - Banila Co
                                    - Belif
                                    - Skin1004
                                    - Purito
                                    - Torriden
                                    - Anua
                                    - TIRTIR
                                    -  Goodal
                                    - Dr. Ceuracle
                                    - Amorepacific
                                    - Holika Holika
                                    - TonyMoly
                                    - VT Cosmetics
                                    - Illiyoon
                                    
                                **Output MUST be in JSON format** and follow this exact structure:  
                                  {
                                      "morning_routine": [
                                        { "step": "Cleanser", "product": "Product Name" },
                                        { "step": "Toner", "product": "Product Name" },
                                        { "step": "Essence", "product": "Product Name" },
                                        { "step": "Moisturizer", "product": "Product Name" },
                                        { "step": "Sunscreen", "product": "Product Name" }
                                      ],
                                      "evening_routine": [
                                        { "step": "Double Cleanse", "product": "Product Name" },
                                        { "step": "Cleanser", "product": "Product Name" },
                                        { "step": "Toner", "product": "Product Name" },
                                        { "step": "Essence", "product": "Product Name" },
                                        { "step": "Moisturizer", "product": "Product Name" }
                                      ]
                                  }`
                    },
                  {
                    role: "user",
                    content: [
                      { 
                        type: "text", 
                        text: `Build a Korean skincare routine with only Korean skincare products based on the following user details:
                        - Age: ${userData.age}
                        - Gender: ${userData.gender}
                        - Skincare Goals: ${userData.goals}
                        `
                 },
                      // {
                      //   type: "image_url",
                      //   image_url: {
                      //     "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fx1f4q8vxfty91.jpg&f=1&nofb=1&ipt=945430cbe0baf1b40571fe5799c0be03f2dfb3764b5d196f731cca376ce738f7&ipo=images",
                      //   },
                      // },
                    ],
                  },
                ],
                store: true,
              }).then((e) => {
                setIsLoading(false);
                if (e.choices[0].message.content) {
                  const routineData = JSON.parse(e.choices[0].message.content);
                  console.log('Parsed routine:', routineData);
                  setSkincareRoutine(routineData);
                }
              })
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error generating skincare routine");
            setIsLoading(false);
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
            <Text style={defaultStyles.onboardingSubTitle} >Here is the currated list of Korean skincare products for you!</Text>
            
            <View style={styles.routineContainer}>
                <Text style={styles.routineTitle}>Morning Routine</Text>
                <FlatList
                    data={skincareRoutine?.morning_routine || []}
                    renderItem={({item}) => (
                        <RoutineView step={item.step} product={item.product} />
                    )}
                    keyExtractor={(item) => item.step}
                />

                <Text style={styles.routineTitle}>Evening Routine</Text>
                <FlatList
                    data={skincareRoutine?.evening_routine || []}
                    renderItem={({item}) => (
                        <RoutineView step={item.step} product={item.product} />
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
        padding: 5,
    },
    stepText: {
        fontSize: 16,
    },
    productText: {
        fontSize: 16,
    }
})

export default OnboardingCard8