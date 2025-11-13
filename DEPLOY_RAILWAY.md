# Guia Completo de Deploy no Railway.app

Este guia detalhado oferece um passo a passo completo para realizar o deploy de uma aplicação no Railway.app, incluindo a configuração de um banco de dados MySQL, variáveis de ambiente e a verificação de logs.

## 1. Criar Conta no Railway e Conectar com GitHub

O Railway utiliza o GitHub como principal método de autenticação e fonte de código para deploy.

### Passo a Passo:

1.  Acesse o site oficial do Railway: [https://railway.app/]() [7].
2.  Clique em **"Log in"** ou **"Sign Up"**.
3.  Escolha a opção de login/cadastro via **GitHub**. O Railway solicitará permissão para acessar seus repositórios.
4.  Após a autenticação, você será redirecionado para o seu **Dashboard** (Painel de Controle).

## 2. Conectar Repositório GitHub e Iniciar Deploy

O processo de deploy no Railway é simplificado, permitindo que você selecione um repositório diretamente do seu GitHub.

### Passo a Passo:

1.  No seu Dashboard, clique em **"+ New Project"** (Novo Projeto).
2.  Selecione a opção **"Deploy from GitHub repo"** (Fazer Deploy a partir de um repositório GitHub) [3].
3.  Selecione o repositório que contém o código da sua aplicação.
4.  O Railway irá analisar o seu código e sugerir as configurações de build. Você terá duas opções:
    *   **Deploy Now**: Inicia o build e o deploy imediatamente com as configurações automáticas.
    *   **Add Variables**: Permite adicionar variáveis de ambiente antes do primeiro deploy.
5.  Recomenda-se escolher **Deploy Now** para o primeiro deploy e, em seguida, configurar as variáveis. O Railway iniciará o processo de build e deploy, e você será levado para o **Project Canvas** (Tela do Projeto).

## 3. Adicionar Serviço MySQL

Para aplicações que requerem um banco de dados MySQL, o Railway oferece um serviço de banco de dados gerenciado que pode ser adicionado ao seu projeto.

### Passo a Passo:

1.  No **Project Canvas**, clique no botão **"+ New"** (Novo) ou use o atalho `Ctrl + K` / `Cmd + K`.
2.  Selecione **"Database"** (Banco de Dados) e, em seguida, escolha **"MySQL"** [4].
3.  O Railway irá provisionar um novo serviço MySQL no seu projeto.

### Variáveis de Conexão Automáticas

Ao provisionar o MySQL, o Railway cria automaticamente um conjunto de **Variáveis de Ambiente** que podem ser referenciadas por outros serviços (como sua aplicação) no mesmo projeto. Essas variáveis incluem [4]:

| Variável | Descrição | Exemplo de Uso |
| :--- | :--- | :--- |
| `MYSQLHOST` | Hostname para conexão (interno ao Railway) | `localhost` ou nome do serviço |
| `MYSQLPORT` | Porta de conexão | `3306` |
| `MYSQLUSER` | Nome de usuário do banco de dados | `root` |
| `MYSQLPASSWORD` | Senha gerada automaticamente | `alguma_senha_aleatoria` |
| `MYSQLDATABASE` | Nome do banco de dados padrão | `railway` |
| `MYSQL_URL` | URL de conexão completa (útil para ORMs) | `mysql://user:pass@host:port/db` |

Sua aplicação deve usar essas variáveis para se conectar ao banco de dados.

## 4. Configurar Variáveis de Ambiente

Variáveis de ambiente são essenciais para armazenar segredos (como chaves de API) e configurações específicas do ambiente de deploy.

### Passo a Passo:

1.  No **Project Canvas**, clique no serviço da sua aplicação (não o MySQL).
2.  Vá para a aba **"Settings"** (Configurações) e, em seguida, para **"Variables"** (Variáveis) [1].
3.  Clique em **"New Variable"** (Nova Variável).
4.  Insira o **Nome** da variável (ex: `API_KEY`) e o **Valor** correspondente.
5.  Para variáveis que referenciam o MySQL, você pode usar a sintaxe de referência. Por exemplo, se sua aplicação espera uma variável `DATABASE_URL`, você pode configurá-la como:
    *   **Nome**: `DATABASE_URL`
    *   **Valor**: `${{MySQL.MYSQL_URL}}` (substituindo `MySQL` pelo nome real do seu serviço de banco de dados, se for diferente).
6.  Após adicionar ou modificar variáveis, o Railway geralmente aciona um novo deploy automaticamente.

## 5. Verificar Logs e Status do Deploy

Monitorar os logs é crucial para diagnosticar problemas de build e de execução da aplicação.

### Passo a Passo:

1.  No **Project Canvas**, clique no serviço da sua aplicação.
2.  Vá para a aba **"Deployments"** (Deploys).
3.  Clique no deploy mais recente para abrir o painel de logs.
4.  O painel de logs exibirá o **Build Log** (Logs de Construção) e o **Deploy Log** (Logs de Deploy/Execução) [5].
    *   **Build Log**: Mostra o processo de instalação de dependências e compilação do código.
    *   **Deploy Log**: Mostra a saída da sua aplicação (ex: `console.log`, `print`) após o início da execução.
5.  **Dica de Debugging**: Se o deploy falhar, verifique o log de build. O erro real pode estar no meio do log, e não necessariamente na última linha [3].

### Usando o CLI para Logs

Você também pode usar a ferramenta de linha de comando (CLI) do Railway para visualizar os logs, após instalá-la e fazer login:

```bash
# Instalar a CLI do Railway (se ainda não estiver instalada)
npm i -g @railway/cli

# Fazer login
railway login

# Navegar para o diretório do projeto e visualizar os logs
railway logs
```

## Referências

[1] Using Variables | Railway Docs. URL: [https://docs.railway.com/guides/variables]()
[2] Variables | Railway Docs. URL: [https://docs.railway.com/reference/variables]()
[3] Quick Start Tutorial | Railway Docs. URL: [https://docs.railway.com/quick-start]()
[4] MySQL | Railway Docs. URL: [https://docs.railway.com/guides/mysql]()
[5] Viewing Logs | Railway Docs. URL: [https://docs.railway.com/guides/logs]()
[6] Logging | Railway Docs. URL: [https://docs.railway.com/reference/logging]()
[7] Railway.app. URL: [https://railway.app/]()