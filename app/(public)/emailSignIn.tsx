import Background from "@/components/Background";
import { defaultStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { useState } from "react";
import auth from '@react-native-firebase/auth'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

const EmailSignIn = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const signIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e:any) {
      alert('Sign in failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const onBackPressed = () => {
    router.back()
  }
  
  return (
    <Background>
      <TouchableOpacity style={styles.chevronBack} onPress={onBackPressed} >
            <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      <View style={defaultStyles.container}>
      
        {/* <Text style={defaultStyles.loginTitle}>Your Korean Skin Care Journey Starts Here!</Text> */}
        <Text style={[defaultStyles.loginTitle, {marginBottom: 40}]}> Sign In to <Text style={{color: '#ED6672', fontFamily: 'NobileBold'}}>SkinSeoulAI</Text></Text>
        <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
        <TextInput style={styles.textInput} placeholder="Password" value={password} onChangeText={setPassword} autoCapitalize="none" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={signIn} >
            <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '90%',
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,  
  },
  button: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 5,
    borderColor: '#ED6672',
    shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,  
  },
  text: {
    color: '#ED6672',
    fontSize: 18, 
    fontWeight: '600',
  },
  chevronBack: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 60,
    left: 10,
    // marginLeft: 15,
    // borderWidth: 1,
    // borderColor: '#D8DADC',
    // borderRadius: 10,
    // padding: 5,
}
});

export default EmailSignIn;