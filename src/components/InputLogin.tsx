import { TextInput, StyleSheet } from "react-native"

const inputLogin =()=>{
    return(
        <TextInput
        placeholder="Digite seu login" 
        style = {styles.inputLogin} 
        />
    )
}

export default inputLogin 

const styles = StyleSheet.create({
    inputLogin:{
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