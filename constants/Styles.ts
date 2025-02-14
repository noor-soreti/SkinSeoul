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
        paddingTop: '5%',
        flex: 1,
        alignItems: 'center',
    },
    onboardingButton: {
        width: '90%',
        backgroundColor: '#ED6672',
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
        // fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center'
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
        backgroundColor: '#fdf1f1',
    },
    screenTitle: {
        fontFamily: 'Nunito Sans',
        fontSize: 34,
        fontWeight: 'medium',
        color: '#100B07'
    },
    topContainer: {
        backgroundColor: '#f8c7cb',
        paddingTop: '15%',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '5%',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        shadowColor: '#e0e0e0e', // Shadow color to match the button for a cohesive look
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    }
})
