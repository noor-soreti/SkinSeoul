import { defaultStyles } from "@/constants/Styles";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingCard8 = ({width, isActive, setScan}: any) => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [skincareRoutine, setSkincareRoutine] = useState(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            const userData = {
                age: await AsyncStorage.getItem("age"),
                gender: await AsyncStorage.getItem("gender"),
                goals: await AsyncStorage.getItem("goals"),
            }

            await openAICall(userData);
        }
        fetchRoutine();
    }, [])

    const openAICall = async (userData: { age: any; gender: any; goals: any}) => {
        try {
            const openai = new OpenAI({
                apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY
              });
              
              const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: "json",
                messages: [
                    {
                        role: "system",
                        content: `You are a skincare expert. Generate a personalized Korean skincare routine based on user data in **strict JSON format**.`
                    },
                  {
                    role: "user",
                    content: [
                      { 
                        type: "text", 
                        text: `Create a Korean skincare routine based on the following user details:
                        - Age: ${userData.age}
                        - Gender: ${userData.gender}
                        - Skincare Goals: ${userData.goals}
                        The JSON response **must** strictly follow this format:
                        {
                        "morning_routine": [
                            { "step": "Step Name", "product": "Product Name", "description": "Short Description" }
                        ],
                        "evening_routine": [
                            { "step": "Step Name", "product": "Product Name", "description": "Short Description" }
                        ],
                        "additional_tips": ["Tip 1", "Tip 2"]
                        }`
                 },
                      {
                        type: "image_url",
                        image_url: {
                          "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fx1f4q8vxfty91.jpg&f=1&nofb=1&ipt=945430cbe0baf1b40571fe5799c0be03f2dfb3764b5d196f731cca376ce738f7&ipo=images",
                        },
                      },
                    ],
                  },
                ],
                store: true,
              }).then((e) => {
                console.log(e.choices[0]);
                setIsLoading(false);
                if (e.choices[0].message && e.choices[0].message.content) {
                    setScan(e.choices[0].message.content[0]);
                }
              })
        } catch (error) {
            console.error("Error fetching OpenAI API:", error);
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
            {/* Activity indicator */}
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