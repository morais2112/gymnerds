import { TextInput, StyleSheet } from "react-native"

const inputCadastroLogin =()=>{
    return(
        <TextInput
        placeholder="Cadastre seu login" 
        style = {styles.inputCadastroLogin} 
        />
    )
}

export default inputCadastroLogin 

const styles = StyleSheet.create({
    inputCadastroLogin:{
        fontFamily: 'Inter_400Regular', 
        width: 300,
        height: 40,
        borderWidth: 1.5,
        borderColor:"#ffffff",
        borderRadius: 9,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
        color:"#ffffff"
    }
})