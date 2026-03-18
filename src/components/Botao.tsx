import { TouchableOpacity, Text, StyleSheet } from "react-native";

const botao=(props:any)=>{
    return(
        <TouchableOpacity>
            <Text style={styles.botao}>{props.textoQ}</Text>
        </TouchableOpacity>
    )
}

export default botao

const styles = StyleSheet.create({
    botao: {
        fontFamily: 'Inter_400Regular',
        margin: 10,
        textAlign: "center",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 10

    },
    textoQ: {
        fontSize: 24,
        
    }
}
)