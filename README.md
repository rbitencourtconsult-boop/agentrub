# AgentRub

Landing page estática do AgentRub — agentes de IA personalizados da RUB Negócios.

## Estrutura

```
/
├── assets/
├── favicon.png
├── index.html
├── styles.css
└── script.js
```

- `index.html` — estrutura HTML semântica, sem CSS e sem JS inline.
- `styles.css` — estilos, animações, responsividade e acessibilidade.
- `script.js` — calculadora, FAQ, seletor RUB/ANA e revelação de seções.

## Como rodar local

Qualquer servidor estático resolve. Exemplo com Python:

```bash
# Python 3
python -m http.server 8080

# ou Python no Windows
py -m http.server 8080
```

Abra `http://localhost:8080` no navegador.

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, keyframes, media queries, prefers-reduced-motion)
- JavaScript puro (ES5+)
- IntersectionObserver (com fallback)
- Intl.NumberFormat para moeda em pt-BR
- Nenhuma dependência, sem build step.

## Funcionalidades

- Navegação por âncoras (smooth scroll)
- Calculadora de custo da rotina (horas × pessoas × valor/hora)
- FAQ interativo com acessibilidade
- Seletor de personagem (RUB / ANA)
- Animações de entrada, flutuação, órbitas e brilhos
- Revelação de seções ao rolar
- Layout responsivo (desktop / tablet / celular)
- Prefers-reduced-motion respeitado

## Identidade visual

- Cor principal: `#001C28`
- Laranja: `#F59E0B`
- Dourado: `#D4A94D`
- Fonte: Poppins (fallback sans-serif)
- Hover em laranja

## Publicação

Basta publicar a raiz do projeto em qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CloudFront etc.).
Nenhum build necessário.
