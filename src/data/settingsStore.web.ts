import { ThemeMode } from "../theme/colors"

let temaAtual: ThemeMode = "dark"

export const initSettings = () => {
    // no-op no web; nao persiste entre reloads
}

export const getTema = (): ThemeMode => temaAtual

export const setTema = (tema: ThemeMode) => {
    temaAtual = tema
}
