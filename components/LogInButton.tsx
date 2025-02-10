import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LogInButton({title, onPressFunction, key}: any) {    
    return (
        <TouchableOpacity key={key} style={styles.button} onPress={() => console.log('Google')}>
            <Text>Sign in with {title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        marginVertical: 15,
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 18, 
        fontWeight: '600',
      },
})