# Checklist de Pré-Deploy

Este checklist deve ser revisado e validado antes de qualquer implantação (deploy) no ambiente de produção ou staging.

## 1. Arquivos de Configuração

- [ ] Todos os arquivos de configuração específicos do ambiente (ex: `.env.production`, `railway.json`, `nixpacks.toml`, etc.) estão presentes e com os valores corretos.
- [ ] As configurações de **CORS** e **Security Headers** estão ajustadas para o ambiente de destino.
- [ ] As configurações de **Logging** estão definidas para o nível apropriado.

## 2. Variáveis de Ambiente

- [ ] Todas as variáveis de ambiente necessárias (ex: `DATABASE_URL`, `API_KEY`, `SECRET_KEY`) estão configuradas no Railway.
- [ ] Nenhuma credencial sensível está hardcoded no código-fonte.
- [ ] As variáveis de ambiente de **URLs de serviços externos** (ex: APIs, buckets S3) apontam para os ambientes corretos (produção/staging).

## 3. Dependências Atualizadas

- [ ] As dependências do projeto foram revisadas e atualizadas para as versões estáveis mais recentes (ex: `package.json`, `requirements.txt`).
- [ ] O arquivo de lock de dependências (ex: `package-lock.json`, `yarn.lock`, `Pipfile.lock`) está atualizado e commitado.
- [ ] Não há dependências desnecessárias ou não utilizadas.

## 4. Build Local Testado

- [ ] O processo de build local foi executado com sucesso (ex: `npm run build`, `python setup.py sdist`).
- [ ] O build gerado foi testado localmente e funciona conforme o esperado.
- [ ] Todos os testes automatizados (unitários, integração) passaram com sucesso.
- [ ] O código foi revisado e não contém código de debug (ex: `console.log`, `pdb.set_trace()`).

## 5. Banco de Dados Pronto

- [ ] O banco de dados de destino (produção/staging) está acessível e online.
- [ ] Todas as migrações de banco de dados necessárias foram criadas e testadas.
- [ ] As migrações foram aplicadas com sucesso no ambiente de destino (se for o caso de migrações manuais ou pré-deploy).
- [ ] Backups recentes do banco de dados de produção foram realizados.
