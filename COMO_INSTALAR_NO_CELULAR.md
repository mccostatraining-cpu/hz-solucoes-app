# Como Instalar HZ Soluções no Celular

Este guia mostra como instalar o aplicativo **HZ Soluções** como um app nativo no seu celular (Android ou iOS).

## 📱 O que é um PWA?

O HZ Soluções é um **Progressive Web App (PWA)**, que funciona como um aplicativo nativo mas é instalado diretamente pelo navegador, sem precisar da Google Play Store ou App Store.

### Vantagens:
- ✅ Ícone na tela inicial do celular
- ✅ Abre em tela cheia (sem barra do navegador)
- ✅ Funciona offline (após primeira visita)
- ✅ Notificações push
- ✅ Rápido e leve
- ✅ Sempre atualizado automaticamente

---

## 📲 Como Instalar no Android

### Usando Google Chrome:

1. **Abra o aplicativo** no navegador Chrome
   - Acesse o endereço do seu app (ex: `https://seu-dominio.com`)

2. **Aguarde o prompt de instalação**
   - Uma mensagem aparecerá na parte inferior: "Adicionar HZ Soluções à tela inicial"
   - Toque em **"Adicionar"** ou **"Instalar"**

3. **OU use o menu manualmente:**
   - Toque nos **3 pontinhos** no canto superior direito
   - Selecione **"Adicionar à tela inicial"** ou **"Instalar app"**
   - Confirme tocando em **"Adicionar"**

4. **Pronto!** 🎉
   - O ícone do HZ Soluções aparecerá na sua tela inicial
   - Toque no ícone para abrir o app

### Usando outros navegadores (Firefox, Edge, Samsung Internet):

- Toque no **menu** (⋮)
- Selecione **"Adicionar à tela inicial"**
- Confirme a instalação

---

## 🍎 Como Instalar no iPhone (iOS)

### Usando Safari:

1. **Abra o aplicativo no Safari**
   - Acesse o endereço do seu app
   - ⚠️ **Importante:** Deve ser no Safari, não funciona no Chrome iOS

2. **Toque no botão Compartilhar**
   - É o ícone de **quadrado com seta para cima** na barra inferior

3. **Selecione "Adicionar à Tela de Início"**
   - Role para baixo até encontrar essa opção
   - Você verá o ícone do HZ Soluções

4. **Personalize o nome (opcional)**
   - O nome "HZ Soluções" já estará preenchido
   - Toque em **"Adicionar"** no canto superior direito

5. **Pronto!** 🎉
   - O ícone aparecerá na tela inicial do iPhone
   - Toque para abrir o app

---

## 🚀 Após a Instalação

### O que você pode fazer:

- **Abrir o app** tocando no ícone (igual qualquer app nativo)
- **Usar offline** - funciona mesmo sem internet (após primeira visita)
- **Receber notificações** - se habilitado nas configurações
- **Arrastar o ícone** - organize na tela inicial como preferir

### Desinstalar (se necessário):

**Android:**
- Pressione e segure o ícone → "Desinstalar" ou "Remover"

**iOS:**
- Pressione e segure o ícone → "Remover App" → "Excluir"

---

## 🔧 Requisitos Técnicos

### Para funcionar corretamente, você precisa:

1. **Servidor HTTPS**
   - O app deve estar hospedado em um domínio com certificado SSL
   - Exemplo: `https://seu-dominio.com` (não funciona com `http://`)

2. **Arquivos necessários:**
   - ✅ `manifest.json` (já configurado)
   - ✅ `sw.js` (Service Worker - já configurado)
   - ✅ Ícones 192x192 e 512x512 (já criados)

3. **Navegadores compatíveis:**
   - **Android:** Chrome 40+, Firefox 44+, Edge 17+, Samsung Internet 4+
   - **iOS:** Safari 11.3+ (iOS 11.3+)

---

## 🛠️ Como Fazer Deploy

Para que seus usuários possam instalar o app, você precisa hospedá-lo online:

### Opção 1: Vercel (Recomendado - Grátis)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
cd /caminho/do/projeto
vercel
```

### Opção 2: Netlify (Grátis)

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Fazer deploy
cd /caminho/do/projeto
netlify deploy --prod
```

### Opção 3: Railway (Backend + Frontend)

1. Acesse [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático!

---

## ❓ Problemas Comuns

### "Não aparece opção de instalar"

- ✅ Verifique se está usando **HTTPS** (não HTTP)
- ✅ Certifique-se que o `manifest.json` está acessível
- ✅ Verifique se o Service Worker está registrado (F12 → Application → Service Workers)
- ✅ Limpe o cache do navegador e recarregue

### "Ícone não aparece corretamente"

- ✅ Verifique se os arquivos `icon-192.png` e `icon-512.png` existem na pasta `public`
- ✅ Certifique-se que as imagens são PNG válidas
- ✅ Limpe o cache e reinstale o app

### "App não funciona offline"

- ✅ Visite o app pelo menos uma vez com internet
- ✅ Verifique se o Service Worker está ativo
- ✅ Aguarde alguns segundos após a primeira visita

---

## 📞 Suporte

Se tiver problemas com a instalação, verifique:

1. Console do navegador (F12) para erros
2. Status do Service Worker (F12 → Application → Service Workers)
3. Manifest (F12 → Application → Manifest)

---

**Desenvolvido por HZ Soluções** 🚀
