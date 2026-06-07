import { useEffect } from "react"
import { Stack } from "expo-router"
import { useFonts, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { initDatabase } from "../src/database/db"

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
    })

    useEffect(() => {
        initDatabase()
    }, [])

    if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#0f0f14" }} />

    return (
        <SafeAreaProvider>
            <StatusBar style="light" backgroundColor="#0f0f14" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#0f0f14" },
                    headerTintColor: "#ffffff",
                    headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
                    contentStyle: { backgroundColor: "#0f0f14" },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="cadastro" options={{ title: "Cadastro" }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="criarFicha" options={{ title: "Nova Ficha" }} />
                <Stack.Screen
                    name="selecionarExercicio"
                    options={{ title: "Selecionar Exercício" }}
                />
                <Stack.Screen name="registrarPR" options={{ title: "Registrar PR" }} />
                <Stack.Screen name="grafico" options={{ title: "Evolução do PR" }} />
            </Stack>
        </SafeAreaProvider>
    )
}
