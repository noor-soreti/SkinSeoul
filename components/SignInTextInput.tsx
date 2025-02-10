import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignInTextInput({value, onChangeText, key}: any) {    
    return (
        <TextInput key={key} style={styles.button} value={value} onChangeText={onChangeText} />
    )
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        marginVertical: 5,
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
      },
      text: {
        fontSize: 18, 
        fontWeight: '600',
      },
})