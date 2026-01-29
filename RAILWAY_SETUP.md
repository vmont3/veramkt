# Railway Deploy Setup - VERA MKT

## 📋 Variáveis de Ambiente Necessárias

Configure estas variáveis no Railway Dashboard:

### Backend Essenciais
```env
# Database
DATABASE_URL=file:./dev.db

# Claude API
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx

# JWT Secret
JWT_SECRET=sua_chave_secreta_aqui_use_crypto_random

# Backend URL
BACKEND_URL=https://seu-app.railway.app

# Frontend URL (para CORS)
FRONTEND_URL=https://veramkt.com.br
```

### Telegram Bot (Opcional)
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefxxxxxxxxxx
```

### Email Alerts (Opcional)
```env
# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@veramkt.com.br

# OU AWS SES
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@veramkt.com.br
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

### Payment (MercadoPago)
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx
```

## 🚀 Deploy Steps

### 1. Criar Projeto no Railway

1. Acesse: https://railway.app
2. Login com GitHub
3. New Project → Deploy from GitHub repo
4. Selecione: `vmont3/veramkt`

### 2. Configurar Build

Railway detectará automaticamente:
- **Backend:** Node.js (porta $PORT)
- **Root:** `/backend`

### 3. Adicionar Variáveis de Ambiente

No Railway Dashboard:
1. Variables → Add Variable
2. Copie as variáveis acima
3. Preencha os valores

### 4. Deploy

Railway fará deploy automático quando:
- Push para branch `main`
- Qualquer commit novo

### 5. Configurar Domínio

1. Railway Dashboard → Settings → Domains
2. Add Domain: `veramkt.com.br`
3. Configure DNS no Registro.br:

```
Tipo: CNAME
Host: @
Valor: [seu-app].up.railway.app
TTL: 3600
```

Para subdomínios:
```
Tipo: CNAME
Host: app
Valor: [seu-app].up.railway.app

Tipo: CNAME
Host: api
Valor: [seu-app].up.railway.app
```

## 📊 Monitoramento

**Logs:**
```bash
railway logs
```

**Status:**
- Dashboard: https://railway.app/dashboard
- Metrics: CPU, Memory, Network usage
- Deployments: History e rollback

## 🔧 Comandos Railway CLI

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Logs
railway logs

# Open dashboard
railway open

# Set variables
railway variables set KEY=value
```

## 📝 Pós-Deploy Checklist

- [ ] Verificar se app está rodando: `https://seu-app.railway.app`
- [ ] Testar endpoints principais:
  - `GET /api/health` → 200 OK
  - `GET /api/dashboard/overview` → Dados válidos
- [ ] Configurar domínio veramkt.com.br
- [ ] Gerar API key de teste: `POST /api/user/generate-api-key`
- [ ] Testar Hot Leads: Acessar `/painel/hot-leads`
- [ ] Testar Onboarding: Acessar `/painel/onboarding`
- [ ] Iniciar Telegram Bot (se configurado):
  ```bash
  railway run ts-node src/scripts/startTelegramBot.ts
  ```

## 🌐 URLs Finais

Após deploy:
- **Frontend:** https://veramkt.com.br
- **Backend API:** https://api.veramkt.com.br
- **Admin:** https://veramkt.com.br/painel/admin

## ⚠️ Troubleshooting

### App não inicia
- Verificar variáveis de ambiente
- Verificar logs: `railway logs`
- Verificar Procfile e railway.json

### Database errors
- SQLite é file-based, dados não persistem entre deploys
- Recomendação: Migrar para PostgreSQL no Railway
- Railway → New → PostgreSQL
- Atualizar DATABASE_URL para Postgres

### CORS errors
- Verificar FRONTEND_URL no .env
- Adicionar domínio permitido no backend

## 💡 Próximos Passos

1. **Migrar para PostgreSQL** (recomendado para produção)
2. **Configurar Redis** para cache
3. **Adicionar CDN** para assets estáticos
4. **Configurar CI/CD** com GitHub Actions
5. **Monitoramento** com Sentry ou LogRocket

---

**Precisa de ajuda?** Docs: https://docs.railway.app
