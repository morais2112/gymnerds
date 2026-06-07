import { ClassificacaoIMC } from "../types"

// Calcula o IMC pela formula: peso (kg) / altura (m)²
// altura em centimetros e convertida para metros internamente
export const calcularIMC = (
    pesoKg: number | null,
    alturaCm: number | null
): number | null => {
    if (pesoKg === null || alturaCm === null) return null
    if (pesoKg <= 0 || alturaCm <= 0) return null
    const alturaM = alturaCm / 100
    const imc = pesoKg / (alturaM * alturaM)
    return imc
}

// Classifica o IMC segundo a tabela da OMS
export const classificarIMC = (imc: number): ClassificacaoIMC => {
    if (imc < 18.5) return "Abaixo do peso"
    if (imc < 25.0) return "Peso normal"
    if (imc < 30.0) return "Sobrepeso"
    if (imc < 35.0) return "Obesidade grau I"
    if (imc < 40.0) return "Obesidade grau II"
    return "Obesidade grau III"
}

// Cor de destaque por classificacao (para feedback visual)
export const corClassificacao = (c: ClassificacaoIMC): string => {
    switch (c) {
        case "Abaixo do peso":
            return "#4d9dff"
        case "Peso normal":
            return "#4dff9d"
        case "Sobrepeso":
            return "#ffd44d"
        case "Obesidade grau I":
            return "#ff9d4d"
        case "Obesidade grau II":
            return "#ff6d4d"
        case "Obesidade grau III":
            return "#ff4d4d"
    }
}
