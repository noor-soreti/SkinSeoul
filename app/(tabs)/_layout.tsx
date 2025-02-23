import { HapticTab } from "@/components/HapticTab"
import { Image } from "expo-image"
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
                tabBarIcon: ({ focused }) => 
                (
                  focused ?
                  <Image source={require('@/assets/images/tabIcons/home-active.png')} style={{ width: 24, height: 24  }} />
                  :
                  <Image source={require('@/assets/images/tabIcons/home.png')} style={{ width: 24, height: 24  }} />

                )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                title: 'Profile',
                tabBarIcon: ({ focused }) => 
                  (
                    focused ?
                    <Image source={require('@/assets/images/tabIcons/profile-active.png')} style={{ width: 24, height: 24  }} />
                    :
                    <Image source={require('@/assets/images/tabIcons/profile.png')} style={{ width: 24, height: 24  }} />
  
                  )
                }}
            />

        </Tabs>
    )
}

export default TabLayout