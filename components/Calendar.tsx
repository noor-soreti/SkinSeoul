import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CalendarProps {
    onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        generateDaysForMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    }, [selectedDate]);

    useEffect(() => {
        if (daysInMonth.length > 0) {
            const selectedIndex = daysInMonth.findIndex(
                date => date.toDateString() === selectedDate.toDateString()
            );
            if (selectedIndex !== -1) {
                const itemWidth = 68; // Width of each date item
                const scrollPosition = Math.max(0, selectedIndex * itemWidth);
                
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
                }, 100);
            }
        }
    }, [daysInMonth, selectedDate]);

    const generateDaysForMonth = (year: number, month: number) => {
        const date = new Date(year, month, 1);
        const days: Date[] = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        setDaysInMonth(days);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        onDateSelect(date);
    };

    const formatDay = (date: Date): string => {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const formatSelectedDate = (): string => {
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleMonthSelect = (month: number) => {
        const newDate = new Date(selectedDate.setMonth(month));
        setSelectedDate(newDate);
        setShowMonthPicker(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowMonthPicker(true)}
                >
                    <Text style={styles.dropdownText}>{formatSelectedDate()}</Text>
                    <Ionicons name="chevron-down" size={14} color="#6B6B6B" />
                </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
                <ScrollView 
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={68} // Same as itemWidth
                    decelerationRate="fast"
                    contentContainerStyle={styles.scrollContent}
                >
                    {daysInMonth.map((date) => (
                        <>
                            {
                            date.toDateString() === selectedDate.toDateString() 
                            ?
                            <TouchableOpacity
                            key={date.toISOString()}
                            style={[
                                styles.dateItem,
                                styles.selectedDate
                            ]}
                            onPress={() => handleDateSelect(date)}
                            >
                                <LinearGradient
                                    colors={['#FF909A', '#FFCAD0', '#FFE6EB', '#FFEEF2', '#FFCAD0', '#FF909A']} 
                                    locations={[0.05, 0.19, 0.39, 0.56, 0.73, 1]} // Adjust the color transition points
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 1 }} 
                                    style={[
                                        styles.dateItem,
                                        styles.selectedDate
                                    ]}
                                >
                                    <Text style={[
                                    styles.dateNumber,
                                    styles.selectedDateText
                                    ]}>
                                        {date.getDate()}
                                    </Text>
                                    <Text style={[
                                        styles.dayName,
                                        styles.selectedDateText
                                    ]}>
                                        {formatDay(date)}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                            key={date.toISOString()}
                            style={[
                                styles.dateItem,
                            ]}
                            onPress={() => handleDateSelect(date)}
                            >
                                <Text style={[
                                    styles.dateNumber,
                                ]}>
                                    {date.getDate()}
                                </Text>
                                <Text style={[
                                    styles.dayName,
                                ]}>
                                    {formatDay(date)}
                                </Text>
                            </TouchableOpacity>
                        }
                        </>


                        // <TouchableOpacity
                        //     key={date.toISOString()}
                        //     style={[
                        //         styles.dateItem,
                        //         date.toDateString() === selectedDate.toDateString() && styles.selectedDate
                        //     ]}
                        //     onPress={() => handleDateSelect(date)}
                        // >
                        //     <Text style={[
                        //         styles.dateNumber,
                        //         date.toDateString() === selectedDate.toDateString() && styles.selectedDateText
                        //     ]}>
                        //         {date.getDate()}
                        //     </Text>
                        //     <Text style={[
                        //         styles.dayName,
                        //         date.toDateString() === selectedDate.toDateString() && styles.selectedDateText
                        //     ]}>
                        //         {formatDay(date)}
                        //     </Text>
                        // </TouchableOpacity>


                    ))}
                </ScrollView>
            </View>

            <Modal
                transparent={true}
                visible={showMonthPicker}
                animationType="fade"
                onRequestClose={() => setShowMonthPicker(false)}
            >
                <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setShowMonthPicker(false)}
                >
                    <View style={styles.monthPickerContainer}>
                        <View style={styles.monthGrid}>
                            {months.map((month, index) => (
                                <TouchableOpacity
                                    key={month}
                                    style={styles.monthItem}
                                    onPress={() => handleMonthSelect(index)}
                                >
                                    <Text style={[
                                        styles.monthText,
                                        selectedDate.getMonth() === index && styles.selectedMonthText
                                    ]}>
                                        {month}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        borderRadius: 18,
    },
    dropdownContainer: {
        margin: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 24,
        fontFamily: 'Nunito'
    },
    dropdownButton: {
        maxWidth: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#6B6B6B90',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    dropdownText: {
        fontSize: 12,
        color: '#6B6B6B',
        paddingRight: 5,
        paddingLeft: 5
    },
    calendarContainer: {
        height: 120,
        marginVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 2,
    },
    dateItem: {
        width: 68,
        height: 105,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFBFB',
        marginHorizontal: 2,
        borderRadius: 20,
    },
    selectedDate: {
        backgroundColor: '#FF909A',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // This is for Android shadow
    },
    dateNumber: {
        fontSize: 20,
        fontWeight: '400',
        marginBottom: 4,
        color: '#BDBDBD',
    },
    dayName: {
        fontSize: 14,
        fontWeight: '400',
        color: '#BDBDBD'
    },
    selectedDateText: {
        color: '#000000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthPickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    monthItem: {
        width: '33%',
        padding: 10,
        alignItems: 'center',
    },
    monthText: {
        fontSize: 15,
    },
    selectedMonthText: {
        color: '#FF909A',
        fontWeight: 'bold',
    },
});

export default Calendar; 