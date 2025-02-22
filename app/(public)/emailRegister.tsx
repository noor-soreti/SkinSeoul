import Background from "@/components/Background";
import { defaultStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth from '@react-native-firebase/auth'
import { Entypo } from "@expo/vector-icons";

const EmailRegister = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const register = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
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
        <Text style={[styles.title, {marginBottom: 40}]}>Register for a new account</Text>
        <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
        <TextInput style={styles.textInput} placeholder="Password" value={password} onChangeText={setPassword} autoCapitalize="none" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={register} >
            <Text style={styles.text}>Register</Text>
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
    borderWidth: 1,
    // borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 5,
    borderColor: 'white',
    backgroundColor: '#ED6672',
    shadowColor: '#e0e0e0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,  
  },
  text: {
    color: '#FFFFFF',
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

export default EmailRegister;