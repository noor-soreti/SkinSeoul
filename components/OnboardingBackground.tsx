import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const OnboardingBackground = () => {
    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#FFC0C7', '#FFFFFF', '#FFC0C7']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
  });
  

export default OnboardingBackground;