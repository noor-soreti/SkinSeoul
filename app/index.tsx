import Background from "@/components/Background";
import LogInButton from "@/components/LogInButton";
import { defaultStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.signIn();
    const { accessToken, idToken } = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
  }
};

const buttonItems = [
  {title: "Sign in with Apple", onPressFunction: () => { console.log("Apple") }},
  {title: "Sign in with Google", onPressFunction: signInWithGoogle},
  {title: "Sign in with Email", onPressFunction: () => router.push("/(public)/emailSignIn")},
]

const Index = () => {
  return (
    <Background>
      <View style={defaultStyles.container}>
        <Text style={styles.title}>Your Korean Skin Care Journey Starts Here!</Text>
        {
          buttonItems.map((item, index) => (
            <View style={defaultStyles.logInButton} key={index}>
              <LogInButton title={item.title} onPressFunction={item.onPressFunction} />
            </View>
          ))
        }    
        <TouchableOpacity style={{top: 15}} onPress={() => router.push("/(public)/register")}>
          <Text>Don't have an account? <Text style={{color: '#4285F4'}} >Register here</Text> </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15, 
    fontWeight: '800',
    marginBottom: 40,
    fontFamily: 'NobileRegular'
  },
  textInput: {
    height: 50, 
    width: '90%', 
    backgroundColor: '#FFFFFF', 
    borderColor: '#E8EAF6',
    borderWidth: 2,
    borderRadius: 15, 
    marginVertical: 15,
    paddingHorizontal: 25, 
    fontSize: 16, 
    color: '#3C4858',
  },
  button: {
    width: '90%',
    marginVertical: 15,
    padding: 20,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  text: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600',
  },
  termContainer: {
    position: 'absolute', 
    bottom: '5%', 
    width: '90%',
    alignItems: 'center',
  },
  terms: {
    color: 'white',
    fontSize: 12, 
    fontWeight: '600',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0
  }
});

export default Index;