import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Background({children}: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient
        colors={['#ED6672', '#FF7F89', '#FFC0C7', '#FFFFFF', '#FFC0C7', '#FF7F89', '#ED6672']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} 
      /> */}
      <View style={{}} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
});
