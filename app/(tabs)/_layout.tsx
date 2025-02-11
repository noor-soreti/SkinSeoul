import { HapticTab } from "@/components/HapticTab"
import { Stack, Tabs } from "expo-router"
import { Platform } from "react-native"

const TabLayout = () => {
    return (
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          // tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
            <Tabs.Screen
                name="index"
                options={{
                title: 'Home',
                // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />

        </Tabs>
    )
}

export default TabLayout