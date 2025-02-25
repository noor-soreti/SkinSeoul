import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { getData, getObject, storeData } from "@/utils/storageHelper";
import { useState, useEffect } from "react";
import LinearGradientSection from "@/components/LinearGradientSection";
import { MaterialIcons } from '@expo/vector-icons';
import AgePickerModal from '@/components/AgePickerModal';
import auth from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearDatabase } from '@/utils/database';
import { router } from "expo-router";

type UserProfile = {
    age: string | null;
    goals: string[] | null;
}

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile>({ age: null, goals: null });
    const [routineProgress, setRoutineProgress] = useState(0); // 0-100%
    const [showEditAge, setShowEditAge] = useState(false);
    const [showEditGoals, setShowEditGoals] = useState(false);
    const [ age, setAge ] = useState<string | null>(null);
    const [ goals, setGoals ] = useState<string[] | null>(null);
    const [showAgeModal, setShowAgeModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const age = await getData('age');
        const goals = await getObject('goals');
        setProfile({ age, goals });
        // TODO: Calculate routine completion percentage
    };

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: async () => {
                try {
                    await auth().signOut();
                    router.replace("/");
                } catch (error) {
                    console.error('Error during sign out:', error);
                }
            } }
        ]);
    }

    const handleDeleteAccount = async () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                    await clearDatabase();
                    await AsyncStorage.clear();
                    await auth().currentUser?.delete();
                    router.replace("/");
                } catch (error) {
                    console.error('Error during account deletion:', error);
                }
            } }
        ]);
    }

    // const handleEditAge = () => {
    //     setShowAgeModal(true);
    // };

    // const handleEditGoals = () => {
    //     console.log('Edit Goals');
    // };

    // const handleSaveAge = async (newAge: string) => {
    //     await storeData('age', newAge);
    //     setProfile(prev => ({ ...prev, age: newAge }));
    // };

    return (
        <SafeAreaView style={defaultStyles.screenContainer}>
            <Text style={{ paddingTop: 20, paddingLeft: 20, fontSize: 20, fontWeight: 'bold' }} >Profile</Text>
            <ScrollView style={styles.content}>
                {/* Basic Info Section */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>User Information</Text>
                        {/* <TouchableOpacity style={styles.editButton} onPress={handleEditAge}>
                            <Text style={styles.editButtonText}>Edit Age</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Age</Text>
                        <Text style={styles.value}>{profile.age}</Text>
                    </View>
                </View>

                {/* Goals Section */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>Skincare Goals</Text>
                    </View>
                    <View style={styles.goalsContainer}>
                        {profile.goals?.map((goal, index) => (
                            <View key={index} style={styles.goalCard}>
                                <Text style={styles.goalText}>{goal}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Morning Routine Section */}
                {/* <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>Morning Routine Progress</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${routineProgress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{routineProgress}% routine completed</Text>
                </View> */}

                {/* Evening Routine Section */}
                {/* <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>Evening Routine Progress</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${routineProgress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{routineProgress}% routine completed</Text>
                </View> */}

                {/* Settings Section */}
                {/* <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                    </View>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>Notifications</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>App Settings</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                </View> */}

                {/* Account Section */}
                <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>Account</Text>
                    </View>
                    <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
                        <Text style={styles.settingText}>Sign Out</Text>
                        <MaterialIcons name="logout" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.settingItem, styles.deleteAccount]} onPress={handleDeleteAccount}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* <AgePickerModal
                visible={showAgeModal}
                onClose={() => setShowAgeModal(false)}
                onSave={handleSaveAge}
                currentAge={profile.age}
            /> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        // marginBottom: 15,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
    },
    goalItem: {
        fontSize: 16,
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ED6672',
        borderRadius: 4,
    },
    progressText: {
        textAlign: 'center',
        color: '#666',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingText: {
        fontSize: 16,
    },
    deleteAccount: {
        borderBottomWidth: 0,
    },
    deleteText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    editButton: {
        // backgroundColor: '#ED6672',
        // padding: 10,
        // borderRadius: 8,
        // alignItems: 'center',
        // marginTop: 10,
    },
    editButtonText: {
        color: '#ED6672',
        fontSize: 15,
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 5,
    },
    goalCard: {
        backgroundColor: '#FFEFF1',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 5,
    },
    goalText: {
        color: '#FF909A',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ProfileScreen;