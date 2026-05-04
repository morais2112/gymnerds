import {
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import Titulo from "../src/components/Titulo"
import InputLogin from "../src/components/InputLogin"
import InputSenha from "../src/components/InputSenha"
import Botaop from "../src/components/Botaop"

export default function Login() {
    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Titulo />
                    <InputLogin />
                    <InputSenha />

                    <TouchableOpacity
                        style={styles.botaoEntrar}
                        onPress={() => router.replace("/home")}
                    >
                        <Text style={styles.textoEntrar}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/cadastro")}>
                        <Botaop textop="Ainda não se cadastrou? Clique aqui!" />
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#0f0f14",
    },
    flex: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        backgroundColor: "#0f0f14",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    botaoEntrar: {
        backgroundColor: "#ffffff",
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
        color: "#000000",
    },
})
