import { useEffect } from "react"
import { Stack } from "expo-router"
import { useFonts, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { initDatabase } from "../src/database/db"
import { ThemeProvider, useTheme } from "../src/theme/ThemeContext"

// Componente interno que tem acesso ao tema (precisa estar dentro do Provider)
function LayoutInterno() {
    const { mode, colors } = useTheme()

    return (
        <>
            <StatusBar
                style={mode === "dark" ? "light" : "dark"}
                backgroundColor={colors.background}
            />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.text,
                    headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
                    contentStyle: { backgroundColor: colors.background },
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
                <Stack.Screen name="calendario" options={{ title: "Calendário de treinos" }} />
            </Stack>
        </>
    )
}

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
    })

    // useEffect com array vazio - inicializa o SQLite uma vez na montagem
    useEffect(() => {
        initDatabase()
    }, [])

    if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#0f0f14" }} />

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <LayoutInterno />
            </ThemeProvider>
        </SafeAreaProvider>
    )
}
