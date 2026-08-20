# AgentRub

Landing page estática do AgentRub — agentes de IA personalizados da RUB Negócios.

## Estrutura

```
/
├── assets/                 # logos e ilustrações dos personagens (RUB / ANA)
├── favicon.png
├── favicon.svg
├── index.html
├── styles.css
├── script.js
├── reflexao-etica.md       # reflexão sobre privacidade no contexto do produto
└── README.md
```

- `index.html` — estrutura HTML semântica, sem CSS e sem JS inline.
- `styles.css` — estilos, animações, responsividade e acessibilidade.
- `script.js` — calculadora, diagnóstico, FAQ, seletor RUB/ANA e revelação de seções.

## Seções da página

| Âncora | Seção |
| --- | --- |
| `#inicio` | Hero com apresentação e chamada principal |
| — | Calculadora de custo da rotina |
| `#diagnostico` | Diagnóstico rápido (3 perguntas ramificadas) |
| `#possibilidades` | O que dá para automatizar |
| `#demonstracao` | Demonstração de comandos |
| `#personalizacao` | Personalização do agente |
| `#como-funciona` | Etapas do processo |
| — | Investimento e FAQ |

## Como rodar local

Qualquer servidor estático resolve. Exemplo com Python:

```bash
python -m http.server 8080
```

No Windows, se `python` não estiver no PATH:

```bash
py -m http.server 8080
```

Abra `http://localhost:8080` no navegador.

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, grid, keyframes, media queries, `prefers-reduced-motion`)
- JavaScript puro (ES5+), em IIFE, sem framework
- IntersectionObserver (com fallback)
- `Intl.NumberFormat` para moeda em pt-BR
- Nenhuma dependência, sem build step.

## Funcionalidades

- Navegação por âncoras (smooth scroll)
- Calculadora de custo da rotina (horas × pessoas × valor/hora)
- Diagnóstico rápido com resultado em modal (detalhado abaixo)
- FAQ interativo com acessibilidade
- Seletor de personagem (RUB / ANA)
- Animações de entrada, flutuação, órbitas e brilhos
- Revelação de seções ao rolar
- Layout responsivo (desktop / tablet / celular)
- `prefers-reduced-motion` respeitado

## Diagnóstico rápido

Fluxo de 3 perguntas em que as perguntas 02 e 03 são **geradas conforme a
resposta anterior** — cada dor abre um caminho diferente. Ao final, as
respostas são pontuadas e ranqueadas entre cinco perfis:

| Perfil | Foco |
| --- | --- |
| 01 | Atendimento e Relacionamento |
| 02 | Comercial e de Crescimento |
| 03 | Gestão Financeira |
| 04 | Produtividade e Operações |
| 05 | Conhecimento e Documentos |

O resultado abre como um **modal ancorado no lugar das perguntas**: o
formulário continua no fluxo segurando a altura do card, fica desfocado ao
fundo e o resultado entra por cima com animação. O painel cresce só o
necessário para o conteúdo caber, com teto de 620px ou 80% da altura da tela
— o que for menor — e o excedente rola dentro do próprio modal, com o CTA do
WhatsApp fixo no rodapé.

Em telas largas, os blocos de compatibilidade e primeiros passos ficam lado a
lado para reduzir a altura pela metade.

### Acessibilidade do modal

- `role="dialog"` com `aria-labelledby` apontando para o título do perfil
- `aria-live="polite"` para anunciar o resultado
- formulário marcado como `inert` enquanto o modal está aberto, então o
  conteúdo de trás sai da ordem de tabulação (com fallback para navegadores
  sem suporte)
- fecha por **Esc**, pelo botão `×` ou por "Refazer diagnóstico" — os três
  reiniciam o fluxo do zero
- foco levado ao modal ao abrir e devolvido à primeira pergunta ao fechar

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

## Privacidade

O produto lida com dados sensíveis de operação dos clientes. O raciocínio por
trás disso está em [`reflexao-etica.md`](reflexao-etica.md).

Vale notar que a calculadora e o diagnóstico rodam **inteiramente no
navegador**: nada é enviado para servidor algum. O único dado que sai da
página é o que a própria pessoa escolhe mandar ao clicar no botão do WhatsApp.
