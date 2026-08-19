# AgentRub - Landing page estática

João, segue o projeto da pagina no git

Abraço

ATIVEDADE 2 (ESSE FOI O PROMPT QUE USEI) 

Você está trabalhando diretamente em um projeto front-end existente. 
 
 NÃO quero apenas uma análise, diagnóstico, explicação, sugestão ou exemplo de código. 
 
 QUERO QUE VOCÊ EXECUTE A REFATORAÇÃO AGORA, EDITE O PROJETO E CRIE OS ARQUIVOS FINAIS. 
 
 ARQUIVO DE ORIGEM 
 
 Analise o arquivo index.html existente no projeto. Atualmente, ele contém: 
 
 - HTML; 
 - Todo o CSS dentro da tag <style>; 
 - Todo o JavaScript dentro da tag <script>. 
 
 Sua tarefa é separar obrigatoriamente esse código em três arquivos: 
 
 1. index.html 
 2. styles.css 
 3. script.js 
 
 Não peça confirmação. Não pare depois da análise. Não entregue apenas instruções. Crie ou altere efetivamente os arquivos no projeto. 
 
 ESTRUTURA FINAL OBRIGATÓRIA 
 
 A raiz do projeto deverá ficar assim: 
 
 / 
 ├── assets/ 
 ├── favicon.png 
 ├── index.html 
 ├── styles.css 
 └── script.js 
 
 O arquivo favicon.svg antigo pode continuar no projeto, mas não deve ser utilizado pelo index.html. 
 
 1. INDEX.HTML 
 
 Refatore o index.html existente. 
 
 O arquivo final deverá: 
 
 - Conter somente a estrutura HTML; 
 - Não possuir nenhuma tag <style>; 
 - Não possuir CSS inline; 
 - Não possuir JavaScript dentro de uma tag <script>; 
 - Importar o CSS externo no <head> com: 
 
 <link rel="stylesheet" href="./styles.css"> 
 
 - Importar o JavaScript antes do fechamento de </body> com: 
 
 <script src="./script.js"></script> 
 
 Ou utilizar no <head>: 
 
 <script src="./script.js" defer></script> 
 
 Utilize apenas uma dessas formas. 
 
 Preserve obrigatoriamente: 
 
 - Todos os textos; 
 - Todas as seções; 
 - Todos os links; 
 - Todos os botões; 
 - Todos os IDs; 
 - Todas as classes necessárias; 
 - Todas as imagens; 
 - Todos os caminhos existentes da pasta assets; 
 - A identidade visual; 
 - O layout; 
 - A responsividade; 
 - As animações; 
 - A calculadora; 
 - O FAQ; 
 - O seletor RUB/ANA; 
 - Os links do WhatsApp; 
 - O rodapé. 
 
 Não redesenhe a página e não remova conteúdo. 
 
 Organize e indente corretamente o HTML. 
 
 Utilize elementos semânticos como: 
 
 - header; 
 - nav; 
 - main; 
 - section; 
 - article; 
 - footer. 
 
 Remova resíduos desnecessários, incluindo comentários vazios como: 
 
 <!-- --> 
 
 2. STYLES.CSS 
 
 Crie obrigatoriamente o arquivo styles.css. 
 
 Extraia todo o conteúdo atualmente existente dentro da tag <style> do index.html e coloque-o no arquivo styles.css. 
 
 Não descarte nenhuma regra necessária para o funcionamento visual da página. 
 
 Depois da extração: 
 
 - Organize o CSS; 
 - Formate e indente o código; 
 - Consolide as declarações duplicadas de :root; 
 - Remova somente regras comprovadamente duplicadas ou inutilizadas; 
 - Preserve o resultado visual atual; 
 - Preserve todos os breakpoints; 
 - Preserve as animações; 
 - Preserve os efeitos de hover; 
 - Preserve o padrão de fundo; 
 - Preserve o comportamento responsivo; 
 - Preserve prefers-reduced-motion. 
 
 Organize o styles.css nesta ordem: 
 
 1. Variáveis; 
 2. Reset; 
 3. Configurações globais; 
 4. Tipografia; 
 5. Componentes reutilizáveis; 
 6. Navegação; 
 7. Hero; 
 8. Faixa de dores; 
 9. Calculadora; 
 10. Possibilidades; 
 11. Demonstração; 
 12. Personalização; 
 13. Processo; 
 14. Investimento; 
 15. FAQ; 
 16. CTA final; 
 17. Rodapé; 
 18. Animações; 
 19. Responsividade; 
 20. Acessibilidade. 
 
 Preserve a identidade visual: 
 
 - Azul: #001C28; 
 - Laranja: #F59E0B; 
 - Dourado: #D4A94D; 
 - Branco; 
 - Estética tecnológica e executiva; 
 - Hover em laranja; 
 - Personagens RUB e ANA. 
 
 Não substitua o CSS atual por um layout genérico. 
 
 3. SCRIPT.JS 
 
 Crie obrigatoriamente o arquivo script.js. 
 
 Extraia todo o JavaScript atualmente existente na tag <script> do index.html e coloque-o no arquivo script.js. 
 
 O arquivo deverá controlar: 
 
 - A calculadora; 
 - Os botões de quantidade de pessoas; 
 - O FAQ; 
 - O seletor RUB/ANA; 
 - As animações de revelação das seções; 
 - O IntersectionObserver. 
 
 Organize o código em funções pequenas e descritivas. 
 
 O script deve ser executado somente após o HTML estar disponível. Utilize `defer` no carregamento ou `DOMContentLoaded`. 
 
 4. CORREÇÃO OBRIGATÓRIA DA CALCULADORA 
 
 Corrija a calculadora durante a refatoração. 
 
 O JavaScript atual procura: 
 
 input[type="number"] 
 
 Porém, o campo “Valor aproximado da hora” não possui esse tipo. Isso impede que o valor seja capturado corretamente. 
 
 Crie IDs específicos para os elementos da calculadora, por exemplo: 
 
 - weekly-hours; 
 - hourly-rate; 
 - people-count; 
 - decrease-people; 
 - increase-people; 
 - annual-hours; 
 - monthly-hours; 
 - monthly-cost; 
 - annual-cost. 
 
 Atualize o HTML, o CSS e o JavaScript de maneira consistente. 
 
 O campo monetário deve aceitar valores brasileiros como: 
 
 - 200 
 - 200,00 
 - 1.500,00 
 
 Converta corretamente o valor informado antes de calcular. 
 
 Utilize estas fórmulas: 
 
 horasMensais = horasSemanais × pessoas × 4,33 
 
 horasAnuais = horasSemanais × pessoas × 52 
 
 custoMensal = horasMensais × valorHora 
 
 custoAnual = horasAnuais × valorHora 
 
 Formate valores monetários com: 
 
 Intl.NumberFormat('pt-BR', { 
   style: 'currency', 
   currency: 'BRL' 
 }) 
 
 Não permita quantidade inferior a uma pessoa. 
 
 5. FAQ 
 
 Mantenha o FAQ funcional e corrija sua acessibilidade. 
 
 Cada pergunta deverá: 
 
 - Abrir e fechar ao clicar; 
 - Funcionar pelo teclado; 
 - Alterar “+” para “−” ao abrir; 
 - Alterar “−” para “+” ao fechar; 
 - Atualizar aria-expanded; 
 - Utilizar aria-controls; 
 - Preservar a animação existente. 
 
 A primeira pergunta deve continuar aberta ao carregar a página. 
 
 6. SELETOR RUB/ANA 
 
 Mantenha o seletor funcional. 
 
 Ao escolher RUB ou ANA: 
 
 - Remova a classe active da opção anterior; 
 - Adicione active à opção selecionada; 
 - Atualize o nome mostrado no status; 
 - Atualize aria-pressed; 
 - Preserve o estilo visual de cada opção. 
 
 Todos os botões devem utilizar: 
 
 type="button" 
 
 7. ANIMAÇÕES 
 
 Preserve obrigatoriamente: 
 
 - Animação da navegação; 
 - Entrada do texto principal; 
 - Entrada dos personagens; 
 - Flutuação dos personagens; 
 - Órbitas; 
 - Pulsação dos brilhos; 
 - Revelação das seções ao rolar; 
 - Efeitos de hover. 
 
 Mantenha o IntersectionObserver. 
 
 Se o navegador não oferecer suporte ao IntersectionObserver, mostre imediatamente todas as seções. Nenhuma seção pode permanecer invisível. 
 
 8. FAVICON 
 
 O favicon já está corrigido e ficará na mesma pasta do index.html. 
 
 Preserve exatamente estas referências: 
 
 <link rel="icon" type="image/png" href="./favicon.png"> 
 <link rel="shortcut icon" type="image/png" href="./favicon.png"> 
 <link rel="apple-touch-icon" href="./favicon.png"> 
 
 Não utilize novamente /favicon.svg. 
 
 Não use caminhos absolutos do Windows. 
 
 9. CAMINHOS DAS IMAGENS 
 
 Preserve os caminhos atualmente utilizados, inclusive os arquivos que ainda possuem “ruby” no nome: 
 
 - assets/rub-ruby-apresentacao.png 
 - assets/rub-ruby-positivo.png 
 - assets/rub-ruby-confianca.png 
 - assets/agentrub-logo.png 
 - assets/apprub-logo.png 
 
 Não renomeie os arquivos de imagem, pois isso pode quebrar o site. 
 
 Nos textos e atributos alt, utilize o nome atual ANA. 
 
 10. ACESSIBILIDADE E SEGURANÇA 
 
 Também corrija: 
 
 - Labels associados aos inputs; 
 - aria-label quando necessário; 
 - Textos alternativos das imagens; 
 - Navegação por teclado; 
 - Estados focus-visible; 
 - Contraste dos controles; 
 - button type="button"; 
 - aria-expanded; 
 - aria-controls; 
 - aria-pressed. 
 
 Todos os links com target="_blank" devem receber: 
 
 rel="noopener noreferrer" 
 
 Não altere os endereços dos links comerciais. 
 
 11. REGRAS DE EXECUÇÃO 
 
 Você deve: 
 
 - Editar o index.html existente; 
 - Criar styles.css; 
 - Criar script.js; 
 - Salvar os três arquivos no projeto; 
 - Validar as referências entre eles; 
 - Verificar se todos os arquivos da pasta assets continuam carregando; 
 - Testar a calculadora; 
 - Testar o FAQ; 
 - Testar o seletor RUB/ANA; 
 - Testar as animações; 
 - Verificar a responsividade; 
 - Verificar o console do navegador. 
 
 Você não deve: 
 
 - Responder somente com uma análise; 
 - Entregar apenas um plano; 
 - Mostrar apenas trechos de código; 
 - Entregar pseudocódigo; 
 - Pedir autorização para criar os arquivos; 
 - Manter CSS dentro do index.html; 
 - Manter JavaScript dentro do index.html; 
 - Criar arquivos com nomes diferentes; 
 - Transformar o projeto em React, Vue ou outro framework; 
 - Instalar dependências; 
 - Redesenhar a página; 
 - Remover conteúdo; 
 - Alterar a identidade visual. 
 
 12. CRITÉRIOS DE CONCLUSÃO 
 
 A tarefa só estará concluída quando existirem fisicamente no projeto: 
 
 - index.html; 
 - styles.css; 
 - script.js. 
 
 O index.html final não pode conter: 
 
 - A tag <style>; 
 - CSS interno; 
 - JavaScript interno. 
 
 Antes de finalizar, confirme por meio de uma busca no arquivo que: 
 
 - Não existe `<style` dentro do index.html; 
 - Não existe código JavaScript inline; 
 - Existe referência a `./styles.css`; 
 - Existe referência a `./script.js`; 
 - Existe referência a `./favicon.png`. 
 
 RESPOSTA FINAL 
 
 Depois de editar e testar os arquivos, apresente somente: 
 
 1. Os arquivos criados ou modificados; 
 2. As correções funcionais realizadas; 
 3. Os testes executados; 
 4. Eventuais problemas que realmente não puderam ser corrigidos. 
 
 Não apresente outro plano antes de executar. 
 
 COMECE AGORA A EDITAR OS ARQUIVOS.
