# Pega Bot + Dashboard

Bu repo iki parçadan oluşur:
- Discord bot (mevcut yapı)
- Next.js admin dashboard (`Dashboard/`)

## Mimari
- Bot çalışırken `127.0.0.1:${INTERNAL_API_PORT}` üzerinde internal API açar.
- Dashboard bu internal API'yi kullanarak guild liste/overview/settings verilerini çeker.
- Internal API sadece localhost isteklerine izin verir.
- Dashboard auth için Discord OAuth2 + NextAuth kullanır.

## Ortam değişkenleri
`.env` dosyası oluşturup `.env.example` içeriğini doldurun.

## Kurulum
```bash
npm install
npm --prefix Dashboard install
```

## Çalıştırma
Bot:
```bash
npm run dev
```

Dashboard:
```bash
npm run dashboard:dev
```
Dashboard adresi: `http://127.0.0.1:105`

## PM2 Örneği
```bash
pm2 start "npm run dev" --name pega-bot
pm2 start "npm run dashboard:start" --name pega-dashboard
pm2 save
```
