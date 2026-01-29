# 🚀 Guia Rápido de Deploy - VERA MKT

## Status Atual

✅ Código enviado para GitHub: https://github.com/vmont3/veramkt.git
✅ Arquivos de configuração Railway criados
⏳ Aguardando deploy no Railway

## Deploy via Railway Dashboard

### 1. Criar Projeto
1. Acesse: https://railway.app/dashboard
2. Click "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha: `vmont3/veramkt`
5. Railway detectará automaticamente a configuração

### 2. Configurar Variáveis de Ambiente (CRÍTICO!)

No Railway Dashboard → Variables, adicione:

```env
# Essencial
DATABASE_URL=file:./dev.db
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
JWT_SECRET=sua_chave_secreta_crypto_random
BACKEND_URL=https://veramkt-production.up.railway.app
FRONTEND_URL=https://veramkt.com.br
PORT=3000
NODE_ENV=production

# Telegram Bot (Diferencial Disruptivo!)
TELEGRAM_BOT_TOKEN=seu_token_aqui

# Email (Opcional)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@veramkt.com.br

# MercadoPago (Opcional)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx
```

### 3. Deploy Automático

Railway fará deploy automaticamente quando detectar o push no GitHub.

### 4. Configurar Domínio veramkt.com.br

**No Railway:**
1. Settings → Domains
2. Add Custom Domain: `veramkt.com.br`
3. Anote o CNAME fornecido

**No Registro.br:**
1. Acesse: https://registro.br
2. Meus Domínios → veramkt.com.br → DNS
3. Adicione:

```
Tipo: CNAME
Host: @
Valor: veramkt-production.up.railway.app (ou o CNAME do Railway)
TTL: 3600
```

Para subdomínios:
```
Tipo: CNAME
Host: api
Valor: veramkt-production.up.railway.app

Tipo: CNAME
Host: app
Valor: veramkt-production.up.railway.app
```

## Verificação Pós-Deploy

### 1. Testar Endpoints
```bash
# Health check
curl https://veramkt.com.br/api/health

# Dashboard overview
curl https://veramkt.com.br/api/dashboard/overview
```

### 2. Acessar Painel
- Frontend: https://veramkt.com.br
- Hot Leads: https://veramkt.com.br/painel/hot-leads
- Onboarding: https://veramkt.com.br/painel/onboarding
- Admin: https://veramkt.com.br/painel/admin

### 3. Iniciar Telegram Bot

No Railway Dashboard → Service → Settings → Deploy Lifecycle:

Adicione script de inicialização:
```bash
npm run start & node dist/scripts/startTelegramBot.js
```

Ou via Railway CLI (se tiver token de API):
```bash
railway run ts-node src/scripts/startTelegramBot.ts
```

## Funcionalidades Implementadas

### 🔥 Hot Leads (Disruptivo)
- Real-time intent tracking
- Score 0-100
- Progressão: cold → warm → hot → qualified
- Alertas multi-canal

### 🚀 Auto-Onboarding (Competitor: Klaviyo)
- Quick Scan: 30s
- Full Analysis: 2-3 min
- Puppeteer website learning
- Automatic content generation

### 📢 Sistema de Alertas
- Telegram (HTML formatting)
- Slack (Webhook)
- Email (SendGrid/AWS SES)
- Rate limiting (1 hora)

### 🤖 Telegram Bot (DIFERENCIAL!)
Comandos:
- `/start` - Link account
- `/status` - System status
- `/leads` - Ver hot leads
- `/create [tema]` - Criar conteúdo via Telegram!
- Natural language - Parse intents com Claude

## Próximos Passos

1. ✅ Deploy no Railway
2. ⚙️ Configurar variáveis de ambiente
3. 🌐 Configurar DNS veramkt.com.br
4. 🤖 Ativar Telegram Bot
5. 📊 Migrar para PostgreSQL (recomendado)
6. 🔒 Configurar SSL/HTTPS
7. 📈 Monitorar logs e métricas

## Troubleshooting

### App não inicia
```bash
railway logs
```
Verifique:
- Variáveis de ambiente configuradas?
- DATABASE_URL correto?
- CLAUDE_API_KEY válido?

### CORS errors
- Verificar FRONTEND_URL no Railway
- Deve ser exato: `https://veramkt.com.br`

### Telegram bot não responde
- Verificar TELEGRAM_BOT_TOKEN
- Iniciar bot script manualmente
- Verificar webhook do Telegram

## Contatos

- GitHub: https://github.com/vmont3/veramkt
- Email: vinny.mont3@gmail.com
- Domínio: veramkt.com.br

---

**Código pronto para produção!** 🎉
