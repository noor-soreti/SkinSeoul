import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { AGE_DATA } from '@/constants/AgeData';

interface AgePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (age: string) => void;
    currentAge: string | null;
}

const AgePickerModal: React.FC<AgePickerModalProps> = ({ visible, onClose, onSave, currentAge }) => {
    const [selectedAge, setSelectedAge] = React.useState(currentAge || "-");

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <Text style={styles.title}>Edit Age</Text>
                    
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {AGE_DATA.map((age) => (
                            <TouchableOpacity
                                key={age}
                                style={[
                                    styles.ageItem,
                                    selectedAge === age && styles.selectedAge
                                ]}
                                onPress={() => setSelectedAge(age)}
                            >
                                <Text style={[
                                    styles.ageText,
                                    selectedAge === age && styles.selectedAgeText
                                ]}>
                                    {age}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.saveButton]}
                            onPress={() => {
                                onSave(selectedAge);
                                onClose();
                            }}
                        >
                            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollView: {
        maxHeight: 300,
    },
    ageItem: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
    },
    selectedAge: {
        backgroundColor: '#FFEFF1',
    },
    ageText: {
        fontSize: 16,
        color: '#666',
    },
    selectedAgeText: {
        color: '#FF909A',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#FF909A',
    },
    buttonText: {
        fontSize: 16,
        color: '#666',
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
});

export default AgePickerModal; 