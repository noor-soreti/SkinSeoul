import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%'
    },
    onboardingCard: {
        flex: 1,
    },
    logInButton: {
        width: '100%',
        alignItems: 'center',
        shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,  
    },
})
