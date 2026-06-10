import {
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import Input from "../src/components/Input"
import Botaop from "../src/components/Botaop"
import { useTheme } from "../src/theme/ThemeContext"

export default function Login() {
    const { colors } = useTheme()

    return (
        <SafeAreaView
            style={[styles.safe, { backgroundColor: colors.background }]}
            edges={["top", "bottom"]}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.container,
                        { backgroundColor: colors.background },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text
                        style={[
                            styles.subtitulo,
                            { color: colors.textMuted },
                        ]}
                    >
                        Login
                    </Text>

                    <Input placeholder="Digite seu login" />
                    <Input placeholder="Digite sua senha" secureTextEntry />

                    <TouchableOpacity
                        style={[
                            styles.botaoEntrar,
                            { backgroundColor: colors.accent },
                        ]}
                        onPress={() => router.replace("/home")}
                    >
                        <Text
                            style={[
                                styles.textoEntrar,
                                { color: colors.accentText },
                            ]}
                        >
                            Entrar
                        </Text>
                    </TouchableOpacity>

                    <Botaop
                        textop="Ainda não se cadastrou? Clique aqui!"
                        onPress={() => router.push("/cadastro")}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    logo: {
        width: 220,
        height: 200,
        marginBottom: 8,
    },
    subtitulo: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 20,
    },
    botaoEntrar: {
        width: "85%",
        maxWidth: 420,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 4,
    },
    textoEntrar: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
    },
})
