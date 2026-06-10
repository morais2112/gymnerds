// Paletas de cores para os dois temas
export type ThemeMode = "dark" | "light"

export type ThemeColors = {
    // Backgrounds
    background: string       // tela inteira
    surface: string          // cards
    surfaceAlt: string       // sub-cards / icone box
    border: string

    // Texto
    text: string             // texto principal
    textMuted: string        // texto secundario
    textDim: string          // placeholders
    textInverse: string      // texto em botoes brancos/pretos

    // Acoes
    accent: string           // botoes primarios (Entrar, Salvar)
    accentText: string       // texto sobre accent

    // Semanticas
    danger: string
    success: string
    warning: string
    info: string
    fire: string
}

export const darkColors: ThemeColors = {
    background: "#0f0f14",
    surface: "#1c1c24",
    surfaceAlt: "#2a2a35",
    border: "#2a2a35",

    text: "#ffffff",
    textMuted: "#aaaaaa",
    textDim: "#666",
    textInverse: "#000000",

    accent: "#ffffff",
    accentText: "#000000",

    danger: "#ff4d4d",
    success: "#4dff9d",
    warning: "#ffd44d",
    info: "#4d9dff",
    fire: "#ff6d4d",
}

export const lightColors: ThemeColors = {
    background: "#f5f5f7",
    surface: "#ffffff",
    surfaceAlt: "#ececf0",
    border: "#dcdce0",

    text: "#0f0f14",
    textMuted: "#5a5a65",
    textDim: "#888",
    textInverse: "#ffffff",

    accent: "#0f0f14",
    accentText: "#ffffff",

    danger: "#c62828",
    success: "#1b9959",
    warning: "#b8860b",
    info: "#2563eb",
    fire: "#ea580c",
}

export const getColors = (mode: ThemeMode): ThemeColors =>
    mode === "dark" ? darkColors : lightColors
