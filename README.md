# My Birdhouse — сайт на Astro

Черновик перенесён из вашего дизайна (Kimi export) на Astro. Дизайн, тексты и
реальные цены сохранены как есть. Раздел "Credentials & proof" переписан на
честную версию — без вымышленных отзывов, сертификатов и статистики (в
исходнике были фейковые лицензии, отзывы и цифры "120+ homes" — их убрала).
Контакты в футере заменены на реальные (gzozulin@gmail.com, (236) 516-0675,
Maple Ridge, BC).

## Локальный запуск

```bash
npm install
npm run dev
```
Откроется на http://localhost:4321

## Структура

- `src/components/` — каждый блок лендинга в своём файле (Header, Hero,
  BenefitStrip, ProductLine, AiAssistant, Showcases, Comparison, Pricing,
  Credentials, Faq, InstantQuote, Footer, StickyBar). Правите нужный блок —
  остальное не трогаете.
- `src/styles/global.css` — цвета, шрифты, токены дизайна.
- `public/images/` — картинки из исходного экспорта.

## Что ещё не подключено

- **Форма заявки** (InstantQuote) и **форма в футере** пока ничего никуда не
  отправляют — только показывают тост с оценкой. Чтобы реально получать
  заявки на почту, проще всего подключить бесплатный **Formspree** или
  **Netlify Forms** (пара строк в форме).

## Деплой через GitHub + Cloudflare Pages (бесплатно)

1. Создайте репозиторий на GitHub, запушьте эту папку.
2. На https://dash.cloudflare.com → Workers & Pages → Create → Pages →
   Connect to Git → выберите репозиторий.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Deploy — через ~1 минуту сайт будет на `*.pages.dev`.
6. Дальше в проекте → Custom domains → добавляете свой домен.

После этого любой `git push` с изменённым файлом в `src/components/`
автоматически пересоберёт и обновит сайт.
