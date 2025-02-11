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
    onboardingContainer: {
        alignItems: 'center',
        width: '100%',
        paddingTop: '20%',
        flex: 1
    },
    onboardingButton: {
        width: '90%',
        backgroundColor: '#ED6672',
        padding: 20,
        borderRadius: 10,
        bottom: 0,
        position: 'absolute'
    },
    onboardingTitle: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 32,
    },
    onboardingCaption: {
        fontFamily: 'Inter',
        color: '#757575',
        textAlign: 'center',
        fontSize: 15,
        paddingTop: 25,
        paddingBottom: 40,
        width: '90%'
    },
    onboardingSubTitle: {
        fontFamily: 'NobileRegular',
        fontSize: 17,
        paddingTop: 25,
        paddingBottom: 30
    },
    onboardingButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: '600',
        textAlign: 'center',
    },
    imageContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 5
    },
    imageSelector: {
        padding: 5,
        gap: 5,
        display: 'flex',
        alignItems: 'center'
    },
    imageEllipse: {
        width: 75,
        height: 75,
        backgroundColor: '#0553',
        borderRadius: '50%'
      },
    imageText: {
        textAlign: 'center',
        fontFamily: 'NobileRegular',
        width: '70%',
        fontSize: 10
    }
})
