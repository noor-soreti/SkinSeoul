import { defaultStyles } from "@/constants/Styles";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResponseFormat } from "openai/helpers/zod";
import { set, z } from "zod";

const OnboardingCard8 = ({width, step, setSkincareRoutine, skincareRoutine}: any) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        if (step) {
          setIsLoading(false);
          
          // const test = async () => {
          //   try {
          //     const routine = await AsyncStorage.getItem("skincareRoutine");
          //     console.log('routine', routine);
              
          //   } catch (error) {
          //     console.error("Error fetching OpenAI API:", error);
          //     setIsLoading(false); // Ensure loading state is updated even in case of an error
          //   }
          // }
          // test();
          // const fetchRoutine = async () => {
          //   const userData = {
          //       age: await AsyncStorage.getItem("age"),
          //       gender: await AsyncStorage.getItem("gender"),
          //       goals: await AsyncStorage.getItem("goals"),
          //   }
          //   await openAICall(userData);
          // }
          // fetchRoutine();
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
                apiKey: "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"
              });
              
              const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: zodResponseFormat(RoutineEvent, 'event'),
                messages: [
                    {
                        role: "system",
                        content: `You are a Korean skincare expert. Always respond in strict JSON format.
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
                  console.log(e.choices[0].message.content);
                  setSkincareRoutine(e.choices[0].message.content);
                }
              })
        } catch (error) {
            console.error("Error fetching OpenAI API:", error);
            Alert.alert("Error fetching OpenAI API");
            setIsLoading(false); // Ensure loading state is updated even in case of an error
        }
    }

    if (isLoading) {
        return (
            <View style={[defaultStyles.onboardingContainer, {width: width}]}>
                <Text style={defaultStyles.onboardingTitle} >Generating your ideal skincare routine—just a moment!</Text>
                {/* Activity indicator */}
                <ActivityIndicator style={{flex: 1}} size="large" color="#ED6672" />
            </View>
        )
    }

    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]}>
            <Text style={defaultStyles.onboardingTitle} >Finished!</Text>
            <Text style={defaultStyles.onboardingSubTitle} >Here is the currated list of Korean skincare products for you!</Text>
            
            <FlatList
            data={skincareRoutine}
            renderItem={({item}) => (
                <>
                  <Text> {item.morning_routine} </Text>
                </>
            )}
            style={{flex: 1}}
            />

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

export default OnboardingCard8