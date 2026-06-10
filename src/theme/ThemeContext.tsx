import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ThemeColors, ThemeMode, getColors } from "./colors"
import { getTema, setTema as salvarTema, initSettings } from "../data/settingsStore"

// Tipo do contexto
type ThemeContextValue = {
    mode: ThemeMode
    colors: ThemeColors
    toggleTheme: () => void
    setMode: (m: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ProviderProps = { children: ReactNode }

export const ThemeProvider = (props: ProviderProps) => {
    // useState - guarda o tema atual em memoria do React
    const [mode, setModeState] = useState<ThemeMode>("dark")

    // useEffect com [] - roda 1 vez na montagem, carrega tema salvo do SQLite
    useEffect(() => {
        initSettings()
        const salvo = getTema()
        setModeState(salvo)
    }, [])

    // useEffect com [mode] - sempre que o mode mudar, persiste no SQLite
    useEffect(() => {
        salvarTema(mode)
    }, [mode])

    const toggleTheme = () => {
        setModeState((m) => (m === "dark" ? "light" : "dark"))
    }

    const setMode = (m: ThemeMode) => setModeState(m)

    const colors = getColors(mode)

    return (
        <ThemeContext.Provider value={{ mode, colors, toggleTheme, setMode }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

// Hook para consumir o tema em qualquer componente
export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error("useTheme deve ser usado dentro de <ThemeProvider>")
    }
    return ctx
}
