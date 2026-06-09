# 🏋️‍♂️ GymNerds

O **GymNerds** é uma aplicação móvel desenvolvida para entusiastas de musculação que procuram uma forma simples de organizar os seus treinos, registar recordes pessoais (PRs), acompanhar a evolução do peso corporal, calcular IMC e manter uma rotina consistente de treinos.

O projeto foi construído com **React Native** utilizando a plataforma **Expo** e o sistema de navegação **Expo Router**, com persistência local via **SQLite**.

## 🚀 Tecnologias Utilizadas

* **React Native** & **Expo** (SDK 51)
* **Expo Router** — Navegação baseada em ficheiros (Stack + Tabs)
* **TypeScript** — Tipagem forte e segurança
* **expo-sqlite** — Persistência local em banco de dados relacional
* **react-native-svg** — Gráficos e silhuetas anatómicas vetoriais
* **@expo/vector-icons** — Ícones (Ionicons + MaterialCommunityIcons)
* **@expo-google-fonts/inter** — Tipografia personalizada
* **react-native-safe-area-context** — Áreas seguras em dispositivos com notch

## ✨ Funcionalidades

### Autenticação e Onboarding

* 🔐 Telas de **Login** e **Cadastro** com inputs validados, teclado adaptativo e logo do app.

### Treinos e Fichas

* 📋 **Gestão de fichas** — Criar, editar e remover rotinas de treino personalizadas.
* 💪 **Catálogo com 78 exercícios** organizados por 9 grupos musculares (Peito, Tríceps, Bíceps, Costas, Ombro, Posterior de Coxa, Quadríceps, Panturrilha, Abdómen).
* 🔍 **Filtro por grupo muscular** com silhuetas anatómicas em SVG destacando a área trabalhada.
* 🔁 **Séries × repetições** configuráveis em cada exercício da ficha (modal com defaults editáveis).
* 🗑 **Remoção** rápida de exercícios da ficha pelo ícone de lixeira.

### Recordes Pessoais (PRs)

* 🏆 Registo de peso máximo por exercício com **histórico completo**.
* 📈 **Gráfico de evolução** SVG mostrando a progressão de cada exercício ao longo do tempo, com estatísticas (mínimo, máximo, % de evolução).
* 🖼 **Mini-gráficos** na Home com os exercícios em progresso.

### Saúde e Corpo

* ⚖ **Peso corporal** — Registo histórico do peso com gráfico de evolução.
* 📏 **Perfil físico** — Altura e idade configuráveis na aba *Meus dados*.
* 🧮 **IMC calculado automaticamente** pela fórmula `peso (kg) / altura² (m)` com classificação colorida segundo a OMS (Abaixo do peso, Peso normal, Sobrepeso, Obesidade graus I-III).

### Motivação e Hábito

* 🔥 **Streak de dias seguidos** treinando, calculado em tempo real.
* 📅 **Calendário mensal** estilo heatmap mostrando todos os treinos do mês, com navegação entre meses.
* ✅ **Botão "Treinei hoje!"** — modal de registo rápido escolhendo a ficha utilizada e a duração.
* 📊 **Estatísticas** — Treinos esta semana, treinos este mês, dias seguidos.

### Interface

* 🌙 **Tema escuro** moderno em todo o app.
* 📱 **Design responsivo** — Adapta-se a qualquer tamanho de tela usando `useWindowDimensions`.
* 🎨 **Silhuetas SVG personalizadas** representando cada grupo muscular destacado no corpo humano.

## 📂 Estrutura do Projeto

```text
├── app/                          # Rotas e ecrãs (Expo Router)
│   ├── _layout.tsx              # Stack raiz + inicialização do SQLite
│   ├── index.tsx                # Tela de Login
│   ├── cadastro.tsx             # Tela de Cadastro
│   ├── (tabs)/                  # Menu inferior
│   │   ├── _layout.tsx          # Configuração das tabs
│   │   ├── home.tsx             # Dashboard principal
│   │   ├── fichas.tsx           # Lista de fichas
│   │   ├── exercicios.tsx       # Exercícios + PRs
│   │   └── meusDados.tsx        # Perfil, peso, IMC
│   ├── criarFicha.tsx           # Editor de ficha
│   ├── selecionarExercicio.tsx  # Catálogo com filtros + modal
│   ├── registrarPR.tsx          # Registo de recordes pessoais
│   ├── grafico.tsx              # Gráfico detalhado de evolução de PR
│   └── calendario.tsx           # Calendário de treinos com heatmap
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── BodySilhueta.tsx     # Silhueta anatómica SVG
│   │   ├── CardExercicio.tsx    # Card no catálogo
│   │   ├── CardExercicioFicha.tsx # Card com séries/reps/PR
│   │   ├── CardFicha.tsx        # Card de ficha
│   │   ├── FiltroArea.tsx       # Filtro horizontal por área
│   │   ├── GraficoLinha.tsx     # Gráfico SVG com eixos
│   │   ├── MiniGrafico.tsx      # Mini-gráfico para cards
│   │   ├── ModalRegistrarTreino.tsx # Modal de registo de sessão
│   │   ├── Input.tsx            # Input reutilizável
│   │   ├── Botaop.tsx           # Botão tipo link
│   │   └── Titulo.tsx           # Título responsivo
│   ├── data/                    # Stores e dados
│   │   ├── exercicios.ts        # Catálogo de 78 exercícios
│   │   ├── labelsArea.ts        # Labels com acento e ícones por área
│   │   ├── imcCalc.ts           # Cálculo + classificação do IMC
│   │   ├── streakCalc.ts        # Cálculo de streak e qtd semana
│   │   ├── fichasStore.*.ts     # Store de fichas (native/web)
│   │   ├── prsStore.*.ts        # Store de PRs (native/web)
│   │   ├── pesoStore.*.ts       # Store de peso (native/web)
│   │   ├── perfilStore.*.ts     # Store de perfil (native/web)
│   │   └── sessaoStore.*.ts     # Store de sessões (native/web)
│   ├── database/                # Camada de SQLite
│   │   ├── db.native.ts         # Conexão e schema SQLite (iOS/Android)
│   │   └── db.web.ts            # Stub para web
│   └── types/index.ts           # Definições TypeScript
└── assets/                      # Imagens e ícones do sistema
```

> **Nota:** Os ficheiros `*.native.ts` e `*.web.ts` são escolhidos automaticamente pelo Metro Bundler: SQLite real no celular, armazenamento em memória no navegador.

## 🎓 Conceitos das Aulas Aplicados

| Conceito | Aula | Onde no código |
|---|---|---|
| `useState` | Aula 4 | Praticamente todas as telas (`home.tsx`, `criarFicha.tsx`, `meusDados.tsx`, etc.) |
| `useEffect` com array vazio | Aula 4 | `_layout.tsx` (init do SQLite), `home.tsx` (subscribes) |
| `useEffect` com dependências | Aula 4 / 7 | `criarFicha.tsx` (recarrega ao mudar idFicha), `grafico.tsx` |
| `useEffect` com cleanup | Aula 4 | Todos os subscribes (return `unsub` ou `cancelado = true`) |
| `FlatList` (`data`, `keyExtractor`, `renderItem`) | Aula 6 | `home.tsx`, `fichas.tsx`, `exercicios.tsx`, `calendario.tsx`, etc. |
| Estrutura `app/`, `components/`, `data/`, `types/` | Aula 6 | Toda a estrutura do projeto |
| `_layout.tsx` (Stack + Tabs) | Aula 6 | `app/_layout.tsx`, `app/(tabs)/_layout.tsx` |
| Props tipadas | Aula 6 | Todos os componentes em `src/components/` |
| `SQLite.openDatabaseSync` | Aula 7 | `src/database/db.native.ts` |
| `execSync` (CREATE TABLE) | Aula 7 | `db.native.ts` (6 tabelas + ALTER TABLE) |
| `runSync` (INSERT/UPDATE/DELETE) | Aula 7 | Stores `.native.ts` |
| `getAllSync` (SELECT múltiplo) | Aula 7 | `getRegistros`, `getFichas`, `getSessoes` |
| `getFirstSync` (SELECT único) | Aula 7 | `getPRAtual`, `getPesoAtual`, `getPerfil` |
| `async/await` | Aula 7 | `grafico.tsx` (`carregarRegistrosAsync`) |
| TypeScript interfaces e tipos | Aula 7 | `src/types/index.ts` |
| `useLocalSearchParams` | Aula 6 | `criarFicha.tsx`, `grafico.tsx`, `registrarPR.tsx`, `selecionarExercicio.tsx` |

## 💾 Banco de Dados (SQLite)

O banco `academia.db` é criado automaticamente na primeira execução com 6 tabelas:

```sql
fichas              -- fichas de treino
ficha_exercicios    -- exercícios em cada ficha (com séries e reps)
registros_pr        -- histórico de PRs por exercício
pesos_usuario       -- histórico de peso corporal
perfil_usuario      -- altura e idade (linha única)
sessoes_treino      -- treinos realizados
```

Migrações via `ALTER TABLE` garantem compatibilidade com versões antigas do banco.

## 🛠 Como Executar

Siga os passos abaixo para rodar o projeto localmente:

1. **Clonar o repositório:**

```bash
git clone https://github.com/morais2112/gymnerds.git
cd GymNerds-main
```

2. **Instalar as dependências:**

```bash
npm install
```

3. **Iniciar o servidor do Expo:**

```bash
npx expo start
```

4. **Abrir a aplicação:**

* Instale o **Expo Go** no telemóvel (Android ou iOS).
* No terminal, será gerado um **QR Code**. Leia-o com a câmara ou através do Expo Go.
* Para emulador Android pressione `a`, para iOS pressione `i`.
* Para abrir no navegador (com fallback em memória sem SQLite): pressione `w`.

## 📸 Telas Principais

* **Login / Cadastro** — Logo + inputs + título responsivo
* **Home** — Streak, peso, fichas, gráficos de PR, ações rápidas
* **Fichas** — Lista completa com criar/remover
* **Exercícios** — Catálogo com filtro por área + indicador de PR atual
* **Meus dados** — Perfil (altura/idade), IMC calculado, peso atual, gráfico de evolução, histórico
* **Calendário** — Heatmap mensal de treinos com estatísticas

---

Desenvolvido como projeto académico para a disciplina de **Desenvolvimento Mobile**.
