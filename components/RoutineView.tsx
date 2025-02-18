import { View, Text, StyleSheet } from "react-native";

const RoutineView = ({step, product}: {step: string, product: string}) => {
    return (
        <View style={styles.routineView}>
            <Text>{step}</Text>
            <Text>{product}</Text>
        </View>
    )
}

export default RoutineView;

const styles = StyleSheet.create({
    routineView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})