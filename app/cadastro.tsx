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
import { useTheme } from "../src/theme/ThemeContext"

export default function Cadastro() {
    const { colors } = useTheme()

    return (
        <SafeAreaView
            style={[styles.safe, { backgroundColor: colors.background }]}
            edges={["bottom"]}
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

                    <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                        Cadastro
                    </Text>

                    <Input placeholder="Cadastre seu login" />
                    <Input placeholder="Cadastre sua senha" secureTextEntry />

                    <TouchableOpacity
                        style={[styles.botao, { backgroundColor: colors.accent }]}
                        onPress={() => router.replace("/home")}
                    >
                        <Text style={[styles.texto, { color: colors.accentText }]}>
                            Cadastre-se
                        </Text>
                    </TouchableOpacity>
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
        width: 200,
        height: 180,
        marginBottom: 4,
    },
    subtitulo: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 20,
    },
    botao: {
        width: "85%",
        maxWidth: 420,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    texto: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
    },
})
