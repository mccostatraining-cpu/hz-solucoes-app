# Guia: Como Configurar a Integração com WhatsApp

Este guia mostra como conectar seu aplicativo HZ Soluções ao WhatsApp para enviar e receber mensagens. Usaremos um serviço chamado **Twilio** para fazer essa ponte.

## 🎯 O que você vai conseguir fazer?

- **Enviar comandos por WhatsApp**: `gasto 50 mercado`
- **Receber resumos financeiros**: `saldo`
- **Receber notificações** de novas despesas

## 💰 Custo do Twilio

- **Twilio Sandbox**: Gratuito para testes, com algumas limitações.
- **Número Próprio**: Cerca de $1/mês + taxas por mensagem (muito barato).

Para começar, o **Sandbox gratuito é perfeito**.

---

## 🚀 Passo 1: Criar Conta no Twilio

1.  Acesse [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2.  Preencha o formulário de cadastro.
3.  Verifique seu e-mail e número de telefone.
4.  Responda às perguntas iniciais:
    - **Which product are you here to use?** → Selecione **WhatsApp**
    - **What do you plan to build?** → Selecione **Other**
    - **How do you want to build?** → Selecione **With code**

## 🔑 Passo 2: Encontrar suas Credenciais

No painel principal do Twilio (Console), você encontrará as informações mais importantes:

- **Account SID**: Começa com `AC...`
- **Auth Token**: Uma chave secreta (clique em "Show" para ver)

**Guarde essas duas informações!** Você vai precisar delas no Railway.

![Twilio Console](https://i.imgur.com/O7gC5jS.png)

## 샌드박스 Passo 3: Configurar o WhatsApp Sandbox

O Sandbox é um ambiente de testes gratuito que usa um número compartilhado do Twilio.

1.  No menu lateral esquerdo, vá para **Messaging → Try it out → Send a WhatsApp message**.
2.  Você verá um número de WhatsApp do Twilio e um código de ativação (ex: `join some-word`).
3.  **Pegue seu celular** e envie a mensagem de ativação para o número do Twilio.
    - Exemplo: Envie `join practical-horse` para o número `+1 415 523 8886`.
4.  Você receberá uma mensagem de confirmação do Twilio no seu WhatsApp.

![Twilio Sandbox](https://i.imgur.com/gH1fL3w.png)

## 🔗 Passo 4: Configurar o Webhook

O webhook é o link que o Twilio usará para enviar as mensagens do seu WhatsApp para o seu aplicativo no Railway.

1.  Ainda na página do Sandbox, procure pela seção **"Sandbox settings"**.
2.  No campo **"When a message comes in"**, cole a URL do seu aplicativo + `/api/trpc/whatsapp.webhook`.
    - **URL do seu app**: Você encontra no Railway (Settings → Domains).
    - **Exemplo de URL completa**: `https://hz-solucoes-production.up.railway.app/api/trpc/whatsapp.webhook`
3.  Verifique se o método está como **`HTTP POST`**.
4.  Clique em **"Save"**.

![Webhook Config](https://i.imgur.com/y0aE9t4.png)

## 🛤️ Passo 5: Adicionar Credenciais no Railway

Agora, vamos informar ao seu app como se comunicar com o Twilio.

1.  Acesse seu projeto no **Railway**.
2.  Clique no serviço do seu app (`hz-solucoes-app`).
3.  Vá para a aba **"Variables"**.
4.  Adicione as seguintes variáveis:

| Nome da Variável | Valor |
| :--- | :--- |
| `TWILIO_ACCOUNT_SID` | Seu Account SID (aquele que começa com `AC...`) |
| `TWILIO_AUTH_TOKEN` | Seu Auth Token (a chave secreta) |
| `TWILIO_WHATSAPP_NUMBER` | O número do Sandbox do Twilio (ex: `whatsapp:+14155238886`) |

**Importante**: O número do WhatsApp precisa ter o prefixo `whatsapp:`.

5.  O Railway fará um novo deploy automaticamente com as novas variáveis.

## 📱 Passo 6: Vincular seu Número no App

Seu aplicativo precisa saber que o seu número de WhatsApp pertence a você.

1.  Abra seu aplicativo **HZ Soluções** (pela URL pública).
2.  Faça login.
3.  Vá para **Configurações → Perfil** (ou uma área similar).
4.  Adicione seu número de WhatsApp no formato internacional:
    - **Exemplo Brasil**: `+5511999999999` (código do país + DDD + número)
5.  Salve as alterações.

## ✅ Passo 7: Testar Tudo!

1.  Pegue seu celular.
2.  Abra a conversa com o número do Sandbox do Twilio no WhatsApp.
3.  Envie um comando:
    - `ajuda` (para ver a lista de comandos)
    - `gasto 25 lanche`
    - `saldo`
4.  Você deve receber uma resposta do seu aplicativo!
5.  Abra o app no computador e veja se a despesa de "lanche" apareceu automaticamente.

---

##  Troubleshooting

- **Não recebo resposta no WhatsApp**: Verifique os logs no Railway. Pode ser um erro na URL do webhook ou nas credenciais do Twilio.
- **"Número não vinculado"**: Certifique-se de que você adicionou seu número de WhatsApp no perfil do app HZ Soluções no formato correto (`+55...`).
- **Comando não reconhecido**: Envie `ajuda` para ver se a comunicação está funcionando.

**Parabéns!** Sua integração com WhatsApp está funcionando!
