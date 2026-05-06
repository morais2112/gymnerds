import { TextInput, StyleSheet, TextInputProps } from "react-native"

// Props tipadas - aceita tudo que o TextInput aceita + nossas props extras
type InputProps = TextInputProps & {
    placeholder: string
    secureTextEntry?: boolean
}

const Input = (props: InputProps) => {
    return (
        <TextInput
            {...props}
            placeholderTextColor="#777"
            style={[styles.input, props.style]}
        />
    )
}

export default Input

const styles = StyleSheet.create({
    input: {
        fontFamily: "Inter_400Regular",
        width: "85%",
        maxWidth: 420,
        height: 44,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 12,
        color: "#ffffff",
    },
})
