import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCAN_HISTORY_KEY = 'SCAN_HISTORY';

interface ScanButtonProps {
    onPressScan: () => void;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onPressScan }) => {
    const [showModal, setShowModal] = useState(false);
    const [daysUntilNextScan, setDaysUntilNextScan] = useState<number | null>(null);

    useEffect(() => {
        checkScanAvailability();
    }, []);

    const checkScanAvailability = async () => {
        try {
            const scanHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
            const history = scanHistory ? JSON.parse(scanHistory) : [];
            
            if (history.length > 0) {
                const lastScanDate = new Date(history[history.length - 1]);
                const today = new Date();
                const nextMonday = getNextMonday(lastScanDate);
                
                if (today < nextMonday) {
                    const daysLeft = Math.ceil((nextMonday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    setDaysUntilNextScan(daysLeft);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error('Error checking scan availability:', error);
            return false;
        }
    };

    const getNextMonday = (date: Date): Date => {
        const result = new Date(date);
        result.setDate(date.getDate() + ((7 - date.getDay() + 1) % 7 || 7));
        return result;
    };

    const handleScanPress = async () => {
        const canScan = await checkScanAvailability();
        
        if (canScan) {
            const scanHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
            const history = scanHistory ? JSON.parse(scanHistory) : [];
            history.push(new Date().toISOString());
            await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history));
            onPressScan();
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <TouchableOpacity 
                style={styles.scanButton}
                onPress={handleScanPress}
            >
                <Ionicons name="scan" size={14} color="black" />
                <Text style={styles.scanText}>Scan</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={showModal}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setShowModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Scan Not Available</Text>
                        <Text style={styles.modalText}>
                            To track your skin progress effectively, scans are limited to once per week.
                        </Text>
                        {daysUntilNextScan !== null && (
                            <Text style={styles.modalText}>
                                Next scan scheduled in {daysUntilNextScan} days
                            </Text>
                        )}
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6ECC9',
        padding: 10,
        borderRadius: 20,
        gap: 5,
    },
    scanText: {
        fontSize: 14,
        fontFamily: 'NunitoSans',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'NunitoSans',
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'NunitoSans',
    },
    modalButton: {
        backgroundColor: '#FF909A',
        padding: 10,
        borderRadius: 20,
        width: '50%',
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'NunitoSans',
    },
});

export default ScanButton; 