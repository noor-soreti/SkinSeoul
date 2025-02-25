import { StyleSheet } from "react-native";
import { ColorPalette } from "./Colors";

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
    loginTitle: {
        fontSize: 20, 
        // fontWeight: '800',
        fontFamily: 'NobileRegular',
        textAlign: 'center',
    },
    onboardingContainer: {
        paddingTop: '5%',
        flex: 1,
        alignItems: 'center',
    },
    onboardingButton: {
        width: '90%',
        backgroundColor: ColorPalette.primary,
        padding: 20,
        borderRadius: 10,
        // bottom: 0,
        // position: 'absolute',
        alignSelf: 'center'
    },
    disableOnboardingButton: {
        backgroundColor: 'gray',
    },
    onboardingTitle: {
        fontFamily: 'SCoreDreamBold',
        fontSize: 32,
    },
    onboardingCaption: {
        fontFamily: 'SCoreDreamRegular',
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
    selectedImage: {
        borderWidth: 4,
        borderColor: '#D67974',
        backgroundColor: '#423838'
    },
    imageText: {
        textAlign: 'center',
        fontFamily: 'NobileRegular',
        width: '70%',
        fontSize: 10
    },
    screenContainer: {
        flex: 1,
        backgroundColor: ColorPalette.tertiary,
    },
    screenTitle: {
        fontFamily: 'NunitoSans',
        fontSize: 30,
        fontWeight: 'medium',
        color: ColorPalette.white,
        paddingBottom: 10,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 10,
    },
    topContainer: {
        height: 250,
        // backgroundColor: ColorPalette.primary,
        paddingTop: '15%',
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '5%',
        borderBottomEndRadius: 40,
        borderBottomStartRadius: 40,
    },
    chevronBack: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#D8DADC',
        borderRadius: 10,
        padding: 5,
    }
})
