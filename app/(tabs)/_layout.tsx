import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../../src/theme/ThemeContext"

export default function TabsLayout() {
    const insets = useSafeAreaInsets()
    const { colors } = useTheme()

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
                sceneStyle: { backgroundColor: colors.background },
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 60 + insets.bottom,
                    paddingBottom: 6 + insets.bottom,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.text,
                tabBarInactiveTintColor: colors.textDim,
                tabBarLabelStyle: {
                    fontFamily: "Inter_400Regular",
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="fichas"
                options={{
                    title: "Fichas",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="clipboard-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="exercicios"
                options={{
                    title: "Exercícios",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="barbell-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="meusDados"
                options={{
                    title: "Meus dados",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
