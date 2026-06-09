import { SessaoTreino } from "../types";

let sessoes: SessaoTreino[] = [];

type Listener = () => void;
const listeners: Listener[] = [];
const notificar = () => listeners.forEach((l) => l());

export const getSessoes = (): SessaoTreino[] => {
  return [...sessoes].sort((a, b) => b.data.localeCompare(a.data));
};

export const getSessoesMes = (ano: number, mes: number): SessaoTreino[] => {
  const mesStr = String(mes).padStart(2, "0");
  const inicio = `${ano}-${mesStr}-01`;
  const fim = `${ano}-${mesStr}-32`;
  return sessoes
    .filter((s) => s.data >= inicio && s.data < fim)
    .sort((a, b) => a.data.localeCompare(b.data));
};

export const addSessao = (sessao: SessaoTreino) => {
  sessoes = [...sessoes, sessao];
  notificar();
};

export const removeSessao = (id: string) => {
  sessoes = sessoes.filter((s) => s.id !== id);
  notificar();
};

export const subscribe = (listener: Listener): (() => void) => {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
};
