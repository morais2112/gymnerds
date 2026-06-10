import { TextInput, StyleSheet, TextInputProps } from "react-native"
import { useTheme } from "../theme/ThemeContext"

type InputProps = TextInputProps & {
    placeholder: string
    secureTextEntry?: boolean
}

const Input = (props: InputProps) => {
    const { colors } = useTheme()

    return (
        <TextInput
            {...props}
            placeholderTextColor={colors.textDim}
            style={[
                styles.input,
                {
                    borderColor: colors.text,
                    color: colors.text,
                },
                props.style,
            ]}
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
        borderRadius: 9,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 12,
    },
})
