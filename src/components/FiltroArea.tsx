import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AreaMuscular } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"
import { useTheme } from "../theme/ThemeContext"

type FiltroAreaProps = {
    areas: AreaMuscular[]
    areaSelecionada: AreaMuscular | null
    onSelecionar: (area: AreaMuscular | null) => void
}

const FiltroArea = (props: FiltroAreaProps) => {
    const { colors } = useTheme()

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Botao Todos */}
                <TouchableOpacity
                    style={[
                        styles.botao,
                        {
                            backgroundColor:
                                props.areaSelecionada === null
                                    ? colors.accent
                                    : colors.surface,
                            borderColor:
                                props.areaSelecionada === null
                                    ? colors.accent
                                    : colors.border,
                        },
                    ]}
                    onPress={() => props.onSelecionar(null)}
                >
                    <Ionicons
                        name="apps-outline"
                        size={14}
                        color={
                            props.areaSelecionada === null
                                ? colors.accentText
                                : colors.text
                        }
                    />
                    <Text
                        style={[
                            styles.texto,
                            {
                                color:
                                    props.areaSelecionada === null
                                        ? colors.accentText
                                        : colors.text,
                            },
                        ]}
                    >
                        Todos
                    </Text>
                </TouchableOpacity>

                {/* Botoes das areas */}
                {props.areas.map((area) => {
                    const ativo = area === props.areaSelecionada
                    return (
                        <TouchableOpacity
                            key={area}
                            style={[
                                styles.botao,
                                {
                                    backgroundColor: ativo
                                        ? colors.accent
                                        : colors.surface,
                                    borderColor: ativo
                                        ? colors.accent
                                        : colors.border,
                                },
                            ]}
                            onPress={() => props.onSelecionar(area)}
                        >
                            <BodySilhueta
                                area={area}
                                size={18}
                                cor={ativo ? colors.accentText : colors.text}
                                corBase={ativo ? colors.textMuted : colors.textDim}
                            />
                            <Text
                                style={[
                                    styles.texto,
                                    { color: ativo ? colors.accentText : colors.text },
                                ]}
                            >
                                {labelArea(area)}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default FiltroArea

const styles = StyleSheet.create({
    wrapper: { height: 60 },
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    botao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
    },
    texto: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
    },
})
