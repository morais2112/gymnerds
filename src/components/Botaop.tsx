import{Text, TouchableOpacity, StyleSheet} from 'react-native'

const Botaop = (props:any)=>{
    return(
        <TouchableOpacity>
            <Text style={styles.botao}>{props.textop}</Text>
        </TouchableOpacity>
    )
}

export default Botaop

const styles = StyleSheet.create({
    botao:{
        
        textAlign: "center",
        color: "#fcfcfc",
        margin: 20
    },

    textop:{
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    }
})