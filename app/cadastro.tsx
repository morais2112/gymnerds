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

export default function Cadastro() {
    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* LOGO GymNerds - PNG com fundo transparente */}
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Subtitulo */}
                    <Text style={styles.subtitulo}>Cadastro</Text>

                    <Input placeholder="Cadastre seu login" />
                    <Input placeholder="Cadastre sua senha" secureTextEntry />

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={() => router.replace("/home")}
                    >
                        <Text style={styles.texto}>Cadastre-se</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#0f0f14" },
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        backgroundColor: "#0f0f14",
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
        color: "#aaaaaa",
        fontSize: 18,
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 20,
    },
    botao: {
        backgroundColor: "#ffffff",
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
        color: "#000000",
    },
})
