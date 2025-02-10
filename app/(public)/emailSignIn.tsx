import Background from "@/components/Background";
import LogInButton from "@/components/LogInButton";
import SignInTextInput from "@/components/SignInTextInput";
import { defaultStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EmailSignIn = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const signIn = () => {
    try {
      // sign in flow
    } catch (e:any) {
      alert('Sign in failed: ' + e.message)
    }
  }
  
  return (
    <Background>
      <View style={defaultStyles.container}>
        <Text style={styles.title}>Your Korean Skin Care Journey Starts Here!</Text>
        <Text>Sign In</Text>
        <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
        <TextInput style={styles.textInput} placeholder="Password" value={email} onChangeText={setPassword} autoCapitalize="none"/>
        <TouchableOpacity style={styles.button} onPress={signIn} >
            <Text style={styles.text}>Sign In</Text>
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
    width: '90%',
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,  
  },
  button: {
    width: '90%',
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ED6672',
    shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,  
  },
  text: {
    color: '#FFFFFF'
  },
});

export default EmailSignIn;