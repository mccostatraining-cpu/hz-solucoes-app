# Comandos WhatsApp - HZ Soluções

Depois de configurar a integração com WhatsApp, você pode gerenciar suas finanças diretamente pelo celular, enviando mensagens de texto simples.

## 📱 Como Usar

Basta enviar uma mensagem de texto para o número do Twilio que você configurou. O sistema entende comandos em linguagem natural.

---

## 💸 Registrar Despesas

### Comando: `gasto`

Registra uma nova despesa no sistema.

**Formato**: `gasto [valor] [descrição]`

**Exemplos**:

- `gasto 50 mercado`
- `gasto 150.50 restaurante`
- `gasto 25 lanche`
- `gasto 200 conta de luz`

**O que acontece**:

- A despesa é registrada instantaneamente no banco de dados.
- O sistema tenta categorizar automaticamente baseado na descrição.
- Todos os dispositivos conectados (celular e computador) são atualizados em tempo real via WebSocket.
- Você recebe uma confirmação no WhatsApp.

---

## 💰 Ver Saldo e Resumo

### Comando: `saldo` ou `resumo`

Mostra um resumo financeiro do mês atual.

**Formato**: `saldo` ou `resumo`

**Exemplo de resposta**:

```
Faturamento: R$ 5.000,00
Despesas variáveis: R$ 1.200,50
Despesas fixas: R$ 800,00
Saldo: R$ 3.000,50
```

---

## 📋 Listar Últimas Despesas

### Comando: `despesas`

Lista as 5 últimas despesas registradas.

**Formato**: `despesas`

**Exemplo de resposta**:

```
Últimas despesas:
- mercado: R$ 50,00
- restaurante: R$ 150,50
- lanche: R$ 25,00
- gasolina: R$ 200,00
- farmácia: R$ 45,30
```

---

## 🛒 Ver Itens Pendentes

### Comando: `itens`

Lista os itens pendentes da lista de compras.

**Formato**: `itens`

**Exemplo de resposta**:

```
Itens pendentes:
- Leite - R$ 8,00
- Pão
- Arroz - R$ 25,00
- Feijão
```

---

## ❓ Ver Lista de Comandos

### Comando: `ajuda` ou `help`

Mostra a lista de comandos disponíveis.

**Formato**: `ajuda` ou `help`

**Resposta**:

```
Comandos:
- gasto <valor> <descrição>
- saldo
- despesas
- itens
- ajuda
```

---

## 🔄 Sincronização em Tempo Real

Quando você envia um comando pelo WhatsApp, a atualização acontece **instantaneamente** em todos os dispositivos conectados:

- Se você adicionar uma despesa pelo WhatsApp, ela aparece imediatamente no app do computador.
- Se sua esposa adicionar algo pelo celular dela, você vê na hora no seu.
- Não precisa recarregar a página ou o app!

Isso funciona graças à tecnologia **WebSocket** implementada no sistema.

---

## 💡 Dicas de Uso

**Seja específico na descrição**: Quanto mais detalhada a descrição, melhor o sistema consegue categorizar automaticamente.

- ✅ Bom: `gasto 50 compras no mercado`
- ❌ Ruim: `gasto 50 compras`

**Use valores com centavos quando necessário**:

- `gasto 150.50 restaurante` (com centavos)
- `gasto 150 restaurante` (sem centavos)

**Comandos são flexíveis**: O sistema entende variações. Por exemplo, `saldo` e `resumo` fazem a mesma coisa.

---

## 🔒 Segurança

- Apenas números de WhatsApp vinculados ao seu perfil podem enviar comandos.
- Todas as mensagens são verificadas com assinatura digital do Twilio.
- Ninguém de fora consegue adicionar despesas no seu sistema.

---

## 🆘 Problemas Comuns

**"Número não vinculado"**

- Certifique-se de que você adicionou seu número de WhatsApp no perfil do app HZ Soluções.
- O formato deve ser internacional: `+5511999999999`.

**"Comando não reconhecido"**

- Verifique se você digitou o comando corretamente.
- Envie `ajuda` para ver a lista de comandos disponíveis.

**Não recebo resposta**

- Verifique se você enviou a mensagem de ativação do Sandbox (`join ...`).
- Confira se o webhook está configurado corretamente no Twilio.
- Verifique os logs no Railway para ver se há erros.

---

**Aproveite a praticidade de gerenciar suas finanças pelo WhatsApp!** 📱💰
