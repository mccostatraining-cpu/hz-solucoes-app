# 💰 Bancos de Dados GRATUITOS - Alternativas Gratuitas

## ⚠️ PlanetScale não é mais grátis!

O PlanetScale agora cobra $34/mês (como você viu). Vamos usar alternativas **100% GRATUITAS**!

## 🆓 Opções GRATUITAS (Recomendadas):

### Opção 1: Railway (RECOMENDADO - Grátis) ⭐

**✅ 100% GRATUITO para começar**
- ✅ $5 de crédito grátis por mês
- ✅ Muito fácil de usar
- ✅ Funciona perfeitamente com Vercel
- ✅ MySQL incluído

**Como usar:**
1. Acesse: https://railway.app/
2. Crie conta (use GitHub - é grátis)
3. Clique em "New Project"
4. Clique em "Provision MySQL"
5. **Pronto!** Copie a URL de conexão

**Custo:** GRÁTIS (tem $5 de crédito/mês, suficiente para começar)

---

### Opção 2: Render (Grátis) ⭐

**✅ 100% GRATUITO**
- ✅ Plano gratuito disponível
- ✅ MySQL grátis
- ✅ Fácil de configurar

**Como usar:**
1. Acesse: https://render.com/
2. Crie conta (grátis)
3. Clique em "New +" → "PostgreSQL" (ou MySQL se disponível)
4. Escolha "Free" plan
5. Copie a URL de conexão

**Custo:** GRÁTIS (com algumas limitações, mas funciona!)

---

### Opção 3: Supabase (Grátis) ⭐

**✅ 100% GRATUITO**
- ✅ PostgreSQL (funciona igual MySQL para nosso caso)
- ✅ Muito fácil
- ✅ Interface visual

**Como usar:**
1. Acesse: https://supabase.com/
2. Crie conta (grátis)
3. Crie um novo projeto
4. Vá em "Settings" → "Database"
5. Copie a "Connection string"

**Nota:** É PostgreSQL, mas funciona igual! Só mudar a URL.

**Custo:** GRÁTIS (500MB incluídos, suficiente!)

---

### Opção 4: Neon (Grátis) ⭐

**✅ 100% GRATUITO**
- ✅ PostgreSQL (serverless)
- ✅ Muito rápido
- ✅ Fácil de usar

**Como usar:**
1. Acesse: https://neon.tech/
2. Crie conta (grátis)
3. Crie um projeto
4. Copie a "Connection string"

**Custo:** GRÁTIS (512MB incluídos)

---

### Opção 5: Aiven (Grátis)

**✅ 100% GRATUITO**
- ✅ MySQL grátis
- ✅ $300 de crédito grátis
- ✅ Bom para começar

**Como usar:**
1. Acesse: https://aiven.io/
2. Crie conta (grátis)
3. Crie um serviço MySQL
4. Copie a URL de conexão

**Custo:** GRÁTIS ($300 de crédito)

---

## 🎯 Recomendação: Railway ou Render

Para você que está começando, recomendo:

1. **Railway** (mais fácil) - $5 crédito/mês grátis
2. **Render** (100% grátis) - Plano gratuito disponível
3. **Supabase** (PostgreSQL) - Se não ligar de usar PostgreSQL

## 📝 Como usar qualquer uma dessas opções:

### Passo 1: Criar Banco
- Siga os passos acima para qualquer opção
- **Copie a URL de conexão** (é o que você precisa!)

### Passo 2: Adicionar na Vercel
1. Vá em Settings → Environment Variables
2. Adicione:
   - Nome: `DATABASE_URL`
   - Valor: Cole a URL que você copiou
3. Salve

### Passo 3: Criar Tabelas
```bash
# No seu computador, edite .env:
DATABASE_URL=cole_aqui_a_url

# Execute:
pnpm db:migrate
```

## ✅ Resumo:

- ❌ **PlanetScale** = $34/mês (não é grátis)
- ✅ **Railway** = GRÁTIS ($5 crédito/mês)
- ✅ **Render** = GRÁTIS (plano free)
- ✅ **Supabase** = GRÁTIS (500MB)
- ✅ **Neon** = GRÁTIS (512MB)
- ✅ **Aiven** = GRÁTIS ($300 crédito)

## 🎯 Minha Recomendação:

**Use Railway** - é o mais fácil e você tem $5 grátis por mês, que é mais que suficiente para começar!

Quer ajuda para configurar alguma dessas opções?

