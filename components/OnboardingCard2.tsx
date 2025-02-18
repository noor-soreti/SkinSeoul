import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useRef, useState } from "react";
import ScrollPicker from "react-native-wheel-scrollview-picker";

const dataSource = [ "-", "15", "16", "17", "18", "19", "20", 
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", 
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", 
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", 
    "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", 
    "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", 
    "71", "72", "73", "74", "75", "76", "77", "78", "79", "80"]
   

const OnboardingCard2 = ({width, isActive, setDisableButton, setAge, age}: any) => {
    const [selectedIndex, setSelectedIndex] = useState( age ? dataSource.indexOf(age) : 0);    

    useEffect(() => {
        if (age) {
            console.log('age:', age);
        }
    }, [])

    useEffect(() => {
        // console.log('selectedIndex:', selectedIndex);
        if (selectedIndex == 0) {
            setDisableButton(true)
        } else {
            setAge(dataSource[selectedIndex]);
            setDisableButton(false)
        }
    }, [selectedIndex])

    return (
        <View style={[defaultStyles.onboardingContainer, {width: width}]} >
            <Text style={defaultStyles.onboardingTitle} >How old are you?</Text>
            <Text style={defaultStyles.onboardingCaption}>Age affects skin concerns. This will help us personalize product suggestions based on your age group.</Text>
            <ScrollPicker
                dataSource={dataSource}
                selectedIndex={selectedIndex}
                renderItem={(data, index) => {
                    return (
                    <View style={{width: 100, alignItems: 'center'}}>
                        <Text style={ index == selectedIndex ? styles.activeItem : styles.item } >{data}</Text>
                    </View>
                    )

                    
                }}
                onValueChange={(data, selectedIndex) => {
                    setSelectedIndex(selectedIndex);
                }}
                wrapperHeight={180}
                wrapperBackground="#FFFFFF"
                itemHeight={60}
                highlightColor="#d8d8d8"
                // highlightBorderWidth={2}
                activeItemTextStyle={ { fontSize: 'red'} }
                itemTextStyle={{color: 'red'}}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        width: '90%',
        justifyContent: 'space-evenly'
    },
    button: {
        backgroundColor: '#ED6672',
        height: 100,
        width: 100,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#FFFFFF",
        fontFamily: 'Roboto',
        fontSize: 13,
    },
    agePickerText: {
        color: 'red'
    },
    activeItem: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    item: {
        color: 'gray',
    }
})

export default OnboardingCard2