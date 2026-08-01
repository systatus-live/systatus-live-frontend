# Systatus.Live — Front-end

Aplicação web Angular com SSR para monitoramento de serviços, gestão de integrações e exibição de páginas de status públicas.

## Stack Tecnológica

| Tecnologia | Versão | Papel no Projeto |
|---|---|---|
| Angular | 21.2.0 | Framework principal (standalone components, SSR) |
| TypeScript | 5.9.2 | Linguagem principal |
| Tailwind CSS | 4.3.3 | Sistema de estilização utilitário |
| Spartan NG Brain | 1.1.1 | Primitivos headless para o design system |
| ng-icons / Lucide | — | Biblioteca de ícones |
| ngx-permissions | 19.0.0 | Controle de acesso granular no front-end |
| Chart.js | 4.5.1 | Renderização de gráficos de monitoramento |
| RxJS | 7.8.0 | Programação reativa (interceptors, observáveis) |
| Express | 5.1.0 | Servidor Node.js para o SSR |
| Vitest | 4.0.8 | Execução de testes unitários |
| Docker | — | Containerização multi-stage do build |
| GitLab CI/CD | — | Pipeline de build e deploy contínuo |

---

## Arquitetura e Estrutura de Pastas

```text
src/
├── app/
│   ├── components/        # Componentes Spartan NG Helm (design system compartilhado)
│   ├── guards/            # Guards de navegação (autenticação e redirecionamento)
│   ├── interceptors/      # Interceptors HTTP (injeção de JWT e tratamento de erros)
│   ├── lib/               # Utilitários de instância (ex: classe Alert)
│   ├── pages/             # Telas organizadas por fluxo funcional
│   │   ├── agreements/    # Termos de uso e política de privacidade
│   │   ├── auth/          # Fluxo de autenticação (login, cadastro, OTP, senha)
│   │   ├── contact/       # Página de contato
│   │   ├── home/          # Landing page pública (pre-renderizada)
│   │   ├── panel/         # Painel autenticado (monitors, incidents, account, etc.)
│   │   └── status-public/ # Página de status pública acessível por slug
│   ├── services/          # Serviços de comunicação com a API REST
│   ├── state/             # Estado global reativo via Signals (AppStateService)
│   ├── types/             # Enums, DTOs e mapeamentos de domínio
│   ├── utils/             # Funções utilitárias puras (ex: formatação monetária)
│   ├── app.config.ts      # Bootstrap providers (HTTP, roteamento, SSR hydration)
│   ├── app.config.server.ts # Providers exclusivos do contexto SSR
│   ├── app.routes.ts      # Definição de rotas com lazy loading
│   └── app.routes.server.ts # Estratégia de renderização por rota (SSR/prerender)
├── environments/          # Configurações por ambiente (dev e prod)
├── public/                # Assets estáticos (imagens, logos, favicon)
├── main.ts                # Bootstrap client-side
├── main.server.ts         # Bootstrap server-side (SSR)
├── server.ts              # Servidor Express com AngularNodeAppEngine
└── styles.scss            # Estilos globais, CSS variables e tokens do design system
```

| Pasta | Responsabilidade |
|---|---|
| `components/` | Wrappers Helm sobre primitivos Spartan NG Brain — nunca editados manualmente; adicionados via CLI do Spartan |
| `guards/` | `authGuard` (bloqueia acesso a `/auth` para sessões ativas) e `panelGuard` (valida JWT via API e trata fluxo OTP) |
| `interceptors/` | `jwtInterceptor` (injeta `Authorization: Bearer`) e `httpErrorInterceptor` (trata erros e dispara logout em 401) |
| `pages/` | Telas organizadas por feature; rotas carregadas sob demanda com lazy loading |
| `services/` | Um service por domínio; todos estendem `HttpService`, um wrapper sobre `HttpClient` com `withCredentials: true` |
| `state/` | `AppStateService` centraliza sinais reativos de token, usuário, plano e estado de carregamento global |
| `types/` | Enums tipados de domínio e DTOs de entrada/saída da API |
| `environments/` | Injeção de variáveis de ambiente via `fileReplacements` do Angular CLI |

---

## Padrões e Convenções Técnicas

### Idioma do Código

Código, variáveis, nomes de classe e comentários em inglês. Commits, textos de interface e mensagens de erro em português (PT-BR).

### Estilo de Código e Nomenclaturas

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivos | `kebab-case` com sufixo de camada | `auth.service.ts`, `panel-guard.ts` |
| Classes | `PascalCase` com sufixo obrigatório | `AuthService`, `PanelGuard`, `JwtInterceptor` |
| Variáveis e métodos | `camelCase` | `authFlowId`, `verifyToken()` |
| Enums | `PascalCase` + sufixo `Enum` | `MonitorTypeEnum`, `SubscriptionStatusEnum` |
| DTOs | `PascalCase` + sufixo `DTO` | `SignInOptionsDTO` |
| Rotas (paths) | `kebab-case` em inglês | `/panel/status-page`, `/auth/forgot-password` |
| Aspas | Duplas em todo o TypeScript | `"auth_token"`, `"Bearer"` |
| Acessadores em classe | `public` (template/externo) ou `private` (interno) — nunca `protected` | — |
| Assets | Pasta `public/` com paths iniciados por `/` | `/images/logo.png` |

**Sufixos obrigatórios por camada:**

| Camada | Sufixo | Exemplo |
|---|---|---|
| Componentes | `Component` | `MonitorListComponent` |
| Serviços | `Service` | `MonitorService`, `AuthService` |
| Guards | sem sufixo no arquivo (função exportada) | `panelGuard`, `authGuard` |
| Interceptors | `Interceptor` | `JwtInterceptor`, `HttpErrorInterceptor` |
| Enums | `Enum` | `ChatPlatformEnum`, `InvoiceStatusEnum` |
| DTOs | `DTO` | `SignInOptionsDTO` |

**Estrutura de arquivos por feature:**

Cada feature em `pages/panel/<feature>/` contém seus próprios arquivos de listagem (`<feature>-list`), criação (`<feature>-create`) e edição (`<feature>-edit`), cada um em sua própria subpasta. Componentes que acessam DOM diretamente devem ser condicionados com `@if(isBrowser)` para compatibilidade com SSR.

**Criação de artefatos Angular:** componentes, services, pipes e guards devem ser criados exclusivamente via Angular CLI (`ng generate`). Nunca criar arquivos `.ts`/`.html` manualmente.

---

## Rotas e Segurança

### Roteamento

As rotas são definidas em `app.routes.ts` com lazy loading em todos os módulos funcionais:

| Prefixo | Escopo | Proteção |
|---|---|---|
| `/` | Landing page (pre-renderizada no build) | Pública |
| `/contact` | Formulário de contato | Pública |
| `/agreements/*` | Termos de uso e política de privacidade | Pública |
| `/status/:slug` | Página de status pública por slug | Pública |
| `/auth/*` | Cadastro, login, OTP, recuperação de senha | `authGuard` (bloqueia sessões ativas) |
| `/panel/*` | Dashboard autenticado — monitores, incidentes, conta | `panelGuard` (exige JWT válido) |

Rotas não reconhecidas redirecionam para `/auth/signin`.

A estratégia de renderização é definida em `app.routes.server.ts`: a rota `/` é **pre-renderizada** no build; todas as demais são renderizadas no **cliente** (CSR).

### Autenticação e Autorização

**Mecanismo:** JWT Bearer armazenado em `localStorage` com a chave `auth_token`, replicado em `AppStateService` como signal reativo.

**Fluxo de autenticação:**

1. Credenciais submetidas via `POST /v1/auth/signin` (e-mail/senha ou token Google OAuth 2.0)
2. Token JWT e dados do usuário persistidos em `localStorage` e em `AppStateService`
3. Permissões do usuário carregadas no `ngx-permissions` após autenticação
4. Redirecionamento para `/panel`

**Fluxo de verificação em 2 etapas (OTP):**

Quando a API retorna `needVerifyFlow` no corpo do erro durante a validação do token, o `panelGuard` redireciona para `/auth/verify-account` passando o `authFlowId` via query param. A tela de OTP (6 dígitos) consome `POST /v1/auth/codes` e `PATCH /v1/auth/codes` para validar o código.

**Interceptors:**

| Interceptor | Comportamento |
|---|---|
| `jwtInterceptor` | Injeta o header `Authorization: Bearer {token}` em todas as requisições cujo destino começa com `environment.apiUrl`; ignorado no contexto SSR |
| `httpErrorInterceptor` | Normaliza o formato de erro para `{ status, data, message }`; status `401` em APIs autenticadas dispara `authService.signOut()` e redireciona para login |

**Guards de navegação:**

| Guard | Comportamento |
|---|---|
| `authGuard` | Verifica `auth_token` em `localStorage`; se existente, redireciona para `/panel` |
| `panelGuard` | Verifica `auth_token`; chama `authService.verifyToken()` via API; trata fluxo OTP e remove token inválido antes de redirecionar para `/auth/signin` |

**Controle granular de acesso:**

Permissões são carregadas no `ngx-permissions` após login. Rotas restritas declaram `data.permissions` na definição da rota.

| Permissão | Recurso restrito |
|---|---|
| `STATUS_PAGE` | Configuração e exibição da página de status no painel |
| `CUSTOM_NOTIFICATION` | Canais de notificação customizados |

---

## Conexões e Integrações Externas

| Serviço | Finalidade |
|---|---|
| **Systatus API (REST)** | Back-end principal — toda lógica de negócio, persistência e processamento de monitoramento; prefixo `/v1/` |
| **Google OAuth 2.0** | Autenticação social via SDK GSI carregado dinamicamente (`accounts.google.com/gsi/client`) |
| **Stripe** | Gestão de assinaturas e planos; chave pública injetada via `environment.stripePublishableKey` |
| **Cloudflare Turnstile** | Validação CAPTCHA nos formulários públicos (contato, autenticação) |

---

## Ambiente e Configurações (Environment)

O projeto utiliza o mecanismo de `fileReplacements` do Angular CLI. Cada ambiente possui um arquivo em `src/environments/`:

```typescript
export const environment = {
  apiUrl: "",              // URL base da API REST
  webUrl: "",              // URL base do front-end
  googleOAuthClientId: "", // Client ID do Google OAuth 2.0
  stripePublishableKey: "" // Chave pública do Stripe
};
```

| Arquivo | Configuração Angular CLI |
|---|---|
| `environment.ts` | Desenvolvimento local (padrão) |
| `environment.prod.ts` | `--configuration production` |

**Persistência local (`localStorage`):**

| Chave | Conteúdo |
|---|---|
| `auth_token` | Token JWT da sessão autenticada |

---

## Execução e Comandos Úteis

### Desenvolvimento Local

```bash
npm install
npm start
```

O servidor de desenvolvimento é iniciado na porta `4200` com hot-reload. O back-end local deve estar disponível em `http://localhost:4000`.

### SSR Local

```bash
npm run build
npm run serve:ssr:systatus-live-frontend
```

Inicia o servidor Express com renderização server-side na porta `4000`.

### Containerização e CI/CD

O projeto utiliza um `Dockerfile` multi-stage: estágio `deps` instala dependências, `builder` executa o build Angular e `runner` copia os artefatos para uma imagem Node Alpine enxuta com usuário não-root. O `docker-compose.yml` orquestra o contêiner único da aplicação. A pipeline GitLab CI/CD realiza rebuild da imagem sem cache, substitui o contêiner em execução e remove imagens obsoletas, acionada exclusivamente pela branch `master`.

### Comandos

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento com hot-reload (`ng serve`) |
| `npm run build` | Compila o projeto para produção com SSR em `dist/systatus-live-frontend/` |
| `npm run build -- --watch` | Build incremental em modo watch |
| `npm test` | Executa os testes unitários via Vitest |
| `ng generate component pages/<feature>/<name>` | Cria novo componente de página via CLI |
| `ng generate service services/<name>` | Cria novo serviço via CLI |
| `npx nx g @spartan-ng/cli:ui` | Adiciona novo componente Spartan NG Helm ao design system |
