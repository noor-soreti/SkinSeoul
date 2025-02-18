import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LinearGradientSection = ({children}: any) => {
    return (
        <View>
            <LinearGradient
                colors={['#ED6672', '#ED6672', '#F1818B', '#F49DA4', '#F18790', '#ED6672']}
                style={styles.background}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }} 
            />
            {children}
        </View>
    )
}
export default LinearGradientSection;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#FFFFFF",
      borderWidth: 10,
      borderColor: 'red'
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
    },
  });
  