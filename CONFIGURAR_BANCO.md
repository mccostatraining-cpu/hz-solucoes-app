# Configuração do Serviço MySQL no Railway

Este guia detalha os passos para provisionar um serviço MySQL no Railway, obter a `DATABASE_URL`, e configurar seu projeto para executar migrações e verificar a conexão.

## 1. Adicionar o Serviço MySQL no Railway

O Railway oferece um template de banco de dados MySQL que simplifica o provisionamento.

1.  **Acesse seu Projeto:** Navegue até o painel do seu projeto no Railway.
2.  **Adicione um Novo Serviço:** Clique em **"New"** (Novo) e selecione **"Database"** (Banco de Dados).
3.  **Escolha o MySQL:** Na lista de opções, selecione o template **"MySQL"**.
4.  **Provisionamento:** O Railway irá provisionar o serviço automaticamente. Aguarde a conclusão.
5.  **Renomear (Opcional):** Você pode renomear o serviço de banco de dados para algo mais descritivo, como `mysql-prod`.

## 2. Obter a `DATABASE_URL`

Após o provisionamento, o Railway expõe as credenciais de conexão como variáveis de ambiente.

1.  **Acesse o Serviço MySQL:** Clique no serviço MySQL recém-criado no seu projeto.
2.  **Variáveis de Ambiente:** Navegue até a aba **"Variables"** (Variáveis).
3.  **Localize a URL:** O Railway gera automaticamente a variável `DATABASE_URL` (ou variáveis separadas como `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, etc.).
4.  **Copiar a `DATABASE_URL`:** Copie o valor completo da variável `DATABASE_URL`. Este é o string de conexão que seu aplicativo usará.

> **Nota:** A `DATABASE_URL` geralmente segue o formato:
> `mysql://<user>:<password>@<host>:<port>/<database>`

## 3. Configurar Variáveis de Ambiente no Serviço Principal

Para que seu serviço de aplicação (onde o código está rodando) possa acessar o banco de dados, você deve garantir que a `DATABASE_URL` esteja disponível para ele.

1.  **Vincular Serviço:** No seu serviço de aplicação principal, vá para a aba **"Variables"**.
2.  **Referenciar a Variável:** Adicione uma nova variável de ambiente (por exemplo, `DATABASE_URL`) e defina seu valor para referenciar a variável do serviço MySQL.
    *   **Exemplo:** Se o nome do seu serviço MySQL for `mysql-prod`, você pode usar a sintaxe de referência do Railway: `${{mysql-prod.DATABASE_URL}}`.

## 4. Executar Migrações e Criar Tabelas Iniciais

A execução de migrações é crucial para configurar o esquema do banco de dados.

1.  **Ferramenta de Migração:** Certifique-se de que seu projeto está configurado para usar uma ferramenta de migração (como Alembic para Python, Knex.js para Node.js, ou ferramentas nativas do seu framework).
2.  **Comando de Migração:** Execute o comando de migração do seu projeto. Isso geralmente é feito através de um script de inicialização ou um comando `exec` no Railway.

    *   **Exemplo (via `start.sh` ou `Procfile`):**
        ```bash
        # Exemplo para um projeto Python/Alembic
        alembic upgrade head
        # Comando para iniciar a aplicação
        gunicorn app:app
        ```

    *   **Exemplo (Execução Manual no Railway):**
        No painel do seu serviço de aplicação, você pode usar o recurso **"CLI"** ou **"Deploy Logs"** para executar comandos únicos, se necessário.

3.  **Criação de Tabelas:** A execução bem-sucedida das migrações resultará na criação de todas as tabelas necessárias no banco de dados MySQL provisionado.

## 5. Verificar a Conexão

Você pode verificar a conexão de duas maneiras:

### A. Através da Aplicação

Monitore os logs de deploy do seu serviço de aplicação. Se a aplicação iniciar com sucesso e não reportar erros de conexão com o banco de dados, a conexão está funcional.

### B. Através do Painel do Railway

1.  **Acesse o Serviço MySQL:** Clique no serviço MySQL.
2.  **Aba "Data":** Navegue até a aba **"Data"** (Dados).
3.  **Visualização de Dados:** O Railway tentará se conectar e exibir as tabelas e dados existentes. Se você conseguir ver as tabelas criadas pelas migrações, a conexão está confirmada.

## 6. Troubleshooting Comum

| Problema | Causa Potencial | Solução |
| :--- | :--- | :--- |
| **`Can't connect to MySQL server on 'host'`** | O firewall do Railway está bloqueando a conexão ou o host está incorreto. | Verifique se a `DATABASE_URL` está correta e se o serviço de aplicação está vinculado ao serviço MySQL. O Railway gerencia o firewall interno automaticamente, mas a referência à variável deve estar correta. |
| **`Access denied for user 'user'@'%'`** | Credenciais de usuário ou senha incorretas. | Verifique se a `DATABASE_URL` copiada está completa e correta. Não tente adivinhar as credenciais; use sempre as variáveis de ambiente fornecidas pelo Railway. |
| **`Unknown database 'database_name'`** | O nome do banco de dados na URL está incorreto ou o banco de dados não foi criado. | O Railway geralmente cria o banco de dados padrão. Certifique-se de que seu código não está tentando se conectar a um nome de banco de dados diferente do especificado na `DATABASE_URL`. |
| **`Client does not support authentication protocol requested by server`** | Problema de compatibilidade entre a versão do cliente MySQL (no seu código) e a versão do servidor MySQL (no Railway). | Tente atualizar o driver/biblioteca MySQL no seu projeto (ex: `mysqlclient` para Python, `mysql2` para Node.js) para a versão mais recente que suporte o protocolo de autenticação padrão do MySQL 8. |
| **Migrações falham com `Table '...' already exists`** | As migrações foram executadas parcialmente ou o banco de dados não estava limpo. | Se for um ambiente de teste, considere recriar o serviço MySQL. Em produção, verifique o histórico de migrações na tabela de controle da sua ferramenta de migração. |