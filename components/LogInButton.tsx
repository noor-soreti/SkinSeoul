import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LogInButton({title, onPressFunction, key}: any) {    
    return (
        <TouchableOpacity key={key} style={styles.button} onPress={onPressFunction}>
            <Text>{title}</Text>
        </TouchableOpacity>
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