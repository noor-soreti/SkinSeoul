import { defaultStyles } from "@/constants/Styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useRef, useState } from "react";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { AGE_DATA } from '../constants/AgeData';

const dataSource = AGE_DATA;
   

const OnboardingCard2 = ({width, step, setDisableButton, setAge, age}: any) => {
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