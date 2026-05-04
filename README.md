# 🏋️‍♂️ GymNerds

O **GymNerds** é uma aplicação móvel desenvolvida para entusiastas de musculação que procuram uma forma simples de organizar os seus treinos, registar recordes pessoais (PRs) e gerir as suas fichas de exercícios.

O projeto foi construído com **React Native** utilizando a plataforma **Expo** e o sistema de navegação **Expo Router**.

## 🚀 Tecnologias Utilizadas

* **React Native** & **Expo**
* **Expo Router** (Navegação baseada em ficheiros)
* **TypeScript** (Tipagem forte e segurança)
* **Zustand** (Gestão de estado global leve e eficiente)
* **Lucide React Native** (Ícones da interface)

## ✨ Funcionalidades

* 🔐 **Autenticação**: Fluxo completo de Login e Cadastro de novos utilizadores.
* 📋 **Gestão de Fichas**: Criação de rotinas de treino personalizadas com seleção de exercícios.
* 💪 **Biblioteca de Exercícios**: Consulta de exercícios categorizados por grupo muscular (Peito, Costas, Pernas, etc.).
* 🏆 **Recordes Pessoais (PRs)**: Registo e acompanhamento da evolução de carga e repetições máximas.
* 📱 **Interface Moderna**: Layout intuitivo com navegação por abas (Tabs) e componentes personalizados.

## 📂 Estrutura do Projeto

```text
├── app/                  # Rotas e Ecrãs (Expo Router)
│   ├── (tabs)/           # Navegação principal (Home, Exercícios, Fichas)
│   ├── cadastro.tsx      # Ecrã de criação de conta
│   ├── criarFicha.tsx    # Fluxo de criação de novos treinos
│   ├── registrarPR.tsx   # Registo de recordes pessoais
│   └── index.tsx         # Ponto de entrada (Login)
├── src/
│   ├── components/       # Componentes UI (Botões, Inputs, Cards, Filtros)
│   ├── data/             # Stores do Zustand (fichas, prs) e lista de exercícios
│   └── types/            # Definições de interfaces e tipos TypeScript
└── assets/               # Imagens e ícones do sistema
🛠️ Como Executar
Siga os passos abaixo para rodar o projeto localmente:

Clonar o repositório:

Bash
git clone [https://github.com/morais2112/gymnerds.git](https://github.com/morais2112/gymnerds.git)
cd GymNerds-main
Instalar as dependências:

Bash
npm install
Iniciar o servidor do Expo:

Bash
npx expo start
Abrir a Aplicação:

Instale a app Expo Go no seu telemóvel (Android ou iOS).

No terminal, será gerado um QR Code. Leia-o com a câmara do telemóvel ou através da app Expo Go.

Se preferir, pressione a para abrir num emulador Android ou i para simulador iOS.

Desenvolvido por [Seu Nome / Mateus Morais Lopes]
