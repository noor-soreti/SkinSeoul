import Onboarding from "@/components/Onboarding/Onboarding"
import { defaultStyles } from "@/constants/Styles"
import { getData, getObject } from "@/utils/storageHelper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState, useRef } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native"
import Calendar from '@/components/Calendar'
import ScanButton from '@/components/ScanButton'
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import LinearGradientSection from "@/components/LinearGradientSection"
import CameraComponent from '@/components/CameraComponent'
import { initDatabase, getStepsWithCompletions, updateStepStatus, getRoutineSteps, insertDummyData } from '@/utils/database'
import { RoutineStep, CompletionStatus, LoadingState } from '@/utils/types/database'
import RoutineStepItem from "@/components/RoutineStepItem"
import ErrorToast from '@/components/ErrorToast'
import RoutineToggle from '@/components/RoutineToggle'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const IS_ONBOARDED = "IS_ONBOARDED"

function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'Morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Afternoon';
    } else {
        return 'Evening';
    }
}

const HomeScreen = () => {
    const [ showOnboarding, setShowOnboarding ] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCamera, setShowCamera] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()
    const textRef = useRef<Text>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [routineSteps, setRoutineSteps] = useState<(RoutineStep & { status: CompletionStatus | null })[]>([])
    const [loadingState, setLoadingState] = useState<LoadingState>({
        isLoading: true,
        error: null,
        lastUpdated: null
    });
    const [errorToast, setErrorToast] = useState({
        visible: false,
        message: ''
    });
    // tracks which routine is selected
    const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'evening'>('morning');
    const insets = useSafeAreaInsets();
    const TAB_HEIGHT = 80; 
    
    
    // initialize the database and insert dummy data if needed
    useEffect(() => {
        const setup = async () => {
            try {
                await initDatabase();
                // check if we already have steps
                const existingSteps = await getRoutineSteps('morning');
                // console.log(existingSteps);
                
                if (existingSteps.length === 0) {
                    await insertDummyData();
                }
                await loadRoutineSteps();
            } catch (error) {
                console.error('Failed to initialize:', error);
                setLoadingState({
                    isLoading: false,
                    error: 'Failed to setup database. Please restart the app.',
                    lastUpdated: null
                });
            }
        };
        setup();
    }, []);

    // check if the user has completed the onboarding
    useEffect(() => {
        async function checkFirstLaunch() {
            // await AsyncStorage.clear()
            // await AsyncStorage.setItem(IS_ONBOARDED, 'true')
            const firstLaunch = await AsyncStorage.getItem(IS_ONBOARDED);
            if (!firstLaunch) {
                setShowOnboarding(true);
                console.log("FIRST LAUNCH");
            }
            const skincareRoutine = await getObject('skincareRoutine');
            // console.log('skincareRoutine: ', skincareRoutine);
        }
        checkFirstLaunch()
    }, [])

    // handle the onboarding close
    async function onFirstLaunchClosed() {
        await AsyncStorage.setItem(IS_ONBOARDED, 'true')
        setShowOnboarding(false)
    }

    // handle the date select
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        loadRoutineSteps();  // Reload steps when date changes
    };    
    
    // handle the step press
    const handleStepPress = async (stepId: number) => {
        try {
            const step = routineSteps.find(s => s.id === stepId);
            // toggle between null and completed
            const newStatus = step?.status === 'completed' ? null : 'completed';
            
            // update database if status changed
            if (step?.status !== newStatus) {
                console.log('Updating status from:', step?.status, 'to:', newStatus);
                
                await updateStepStatus(stepId, selectedDate.toISOString().split('T')[0], newStatus as CompletionStatus);
                
                // Update local state immediately
                setRoutineSteps(currentSteps => 
                    currentSteps.map(step => 
                        step.id === stepId 
                            ? { ...step, status: newStatus }
                            : step
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update step status:', error);
            showError('Failed to update step. Please try again.');
        }
    };

    // Add this new handler function
    const handleSkipStep = async (stepId: number) => {
        try {
            const step = routineSteps.find(s => s.id === stepId);
            // Toggle between skipped and null
            const newStatus = step?.status === 'skipped' ? null : 'skipped';
            
            if (step?.status !== newStatus) {
                await updateStepStatus(stepId, selectedDate.toISOString().split('T')[0], newStatus as CompletionStatus);
                // Update local state immediately
                setRoutineSteps(currentSteps => 
                    currentSteps.map(step => 
                        step.id === stepId 
                            ? { ...step, status: newStatus }
                            : step
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update step status:', error);
            showError('Failed to skip step. Please try again.');
        }
    };

    const handleScan = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) return;
        }
        setShowCamera(true);
    };

    const handleImageCaptured = (imageUri: string, savedUri: string) => {
        setCapturedImage(imageUri);
        console.log('Photo captured:', imageUri);
        console.log('Photo saved to:', savedUri);
        setShowCamera(false);
    };

    const loadRoutineSteps = async () => {
        setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Format date to YYYY-MM-DD for database consistency
            const formattedDate = selectedDate.toISOString().split('T')[0];
            console.log('Loading routine for date:', formattedDate, 'type:', selectedRoutine);
            
            const steps = await getStepsWithCompletions(
                formattedDate,  // Use formatted date instead of full ISO string
                selectedRoutine
            );
            console.log('Retrieved steps from database:', steps);
            setRoutineSteps(steps);
            setLoadingState({
                isLoading: false,
                error: null,
                lastUpdated: new Date()
            });
        } catch (error) {
            console.error('Failed to load routine steps:', error);
            setLoadingState({
                isLoading: false,
                error: 'Failed to load your routine. Please try again.',
                lastUpdated: null
            });
        }
    }

    // Add useEffect to watch selectedRoutine changes
    useEffect(() => {
        // console.log('selectedRoutine changed, loading steps for:', selectedRoutine);
        loadRoutineSteps();
    }, [selectedRoutine, selectedDate]);

    // Loading and Error components
    const LoadingView = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ED6672" />
            <Text style={styles.loadingText}>Loading your routine...</Text>
        </View>
    );

    const ErrorView = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{loadingState.error}</Text>
            <TouchableOpacity 
                onPress={loadRoutineSteps} 
                style={styles.retryButton}
            >
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    const showError = (message: string) => {
        setErrorToast({ visible: true, message });
        // Hide after 3 seconds
        setTimeout(() => {
            setErrorToast({ visible: false, message: '' });
        }, 3000);
    };

    return (
        <View style={defaultStyles.screenContainer}>
            <LinearGradientSection>
            <View style={[defaultStyles.topContainer, styles.topContainerAdjust]}>
                <View style={styles.titleContainer}>
                    <Text ref={textRef} style={defaultStyles.screenTitle}>
                        {'Good\n' + getGreeting() + '!'}
                    </Text>
                    <ScanButton onPressScan={handleScan} />
                </View>                
            </View>
            </LinearGradientSection>

            <View style={styles.calendarWrapper}>
                <Calendar onDateSelect={handleDateSelect} />
            </View>

            <ScrollView 
                style={styles.routineList}
                contentContainerStyle={[
                    styles.routineListContent,
                    { paddingBottom: insets.bottom + TAB_HEIGHT }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <RoutineToggle 
                    selectedRoutine={selectedRoutine}
                    onToggle={(routine) => {
                        console.log('Toggle pressed, new routine:', routine);
                        console.log('Current selectedRoutine before update:', selectedRoutine);
                        setSelectedRoutine(routine);
                    }}
                />

                {loadingState.isLoading ? (
                    <LoadingView />
                ) : loadingState.error ? (
                    <ErrorView />
                ) : routineSteps.length > 0 ? (
                    routineSteps.map(step => (
                        <RoutineStepItem
                            key={step.id}
                            step={step}
                            onPress={() => handleStepPress(step.id)}
                            onSkip={() => handleSkipStep(step.id)}
                        />
                    ))
                ) : (
                    <Text style={styles.noSteps}>No routine steps found</Text>
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                presentationStyle="fullScreen"
                visible={showOnboarding}
                onRequestClose={() => setShowOnboarding(false)}
            >
                <Onboarding onClose={onFirstLaunchClosed} />
            </Modal>

            <CameraComponent 
                isVisible={showCamera}
                onClose={() => setShowCamera(false)}
                onImageCaptured={handleImageCaptured}
            />

            <ErrorToast 
                visible={errorToast.visible}
                message={errorToast.message}
            />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    productItem: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        
    },
    step: {
        borderColor: '#758599',
        borderWidth: 1,
        padding: 4,
        textAlign: 'center',
        borderRadius: 15,
        color: '#758599'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    closeCamera: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    topContainerAdjust: {
        paddingBottom: 60,
    },
    calendarWrapper: {
        marginHorizontal: 25,
        borderRadius: 18,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -90,
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    routineList: {
        flex: 1,
    },
    routineListContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    noSteps: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ED6672',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#ED6672',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
    },
})