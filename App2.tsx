import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { StyleSheet, Text, View } from 'react-native';
import InputCadastroLogin from './src/components/inputCadastroLogin';
import InputCadastroSenha from './src/components/inputCadastroSenha';
import Botao from './src/components/Botao';

export default function App2() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  })
  if (!fontsLoaded) return null 
  return (
      <View style={styles.container}>
        <InputCadastroLogin/>
        <InputCadastroSenha/>
        <Botao textoQ = "Cadastre-se"/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f14',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

