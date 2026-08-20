/* global document, window, IntersectionObserver, Intl */

(function () {
  'use strict';

  /**
   * Converte string no formato brasileiro para número.
   * Exemplos: "200", "200,00", "1.500,00", "1.500"
   * Retorna 0 para valores inválidos.
   */
  function parseBrlCurrency(value) {
    if (typeof value !== 'string') return 0;
    var cleaned = value.replace(/[^\d,\-]/g, '');
    if (!cleaned) return 0;
    var normalized = cleaned.replace(',', '.');
    var number = parseFloat(normalized);
    return isNaN(number) ? 0 : number;
  }

  /**
   * Formata número como moeda brasileira.
   */
  function formatCurrencyBrl(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  }

  /**
   * Inicializa a calculadora de custo da rotina.
   */
  function initCalculator() {
    var hoursInput = document.getElementById('weekly-hours');
    var hourlyInput = document.getElementById('hourly-rate');
    var peopleDecrease = document.getElementById('decrease-people');
    var peopleIncrease = document.getElementById('increase-people');
    var peopleDisplay = document.getElementById('people-count');
    var hoursValueLabel = document.getElementById('weekly-hours-value');
    var yearlyHoursEl = document.getElementById('annual-hours');
    var monthlyHoursEl = document.getElementById('monthly-hours');
    var monthlyCostEl = document.getElementById('monthly-cost');
    var yearlyCostEl = document.getElementById('annual-cost');

    var hasAllElements = hoursInput && hourlyInput && peopleDecrease && peopleIncrease &&
      peopleDisplay && hoursValueLabel && yearlyHoursEl &&
      monthlyHoursEl && monthlyCostEl && yearlyCostEl;

    if (!hasAllElements) return;

    var MAX_PEOPLE = 200;
    var people = 1;

    function updateCalculator() {
      var hoursWeek = parseInt(hoursInput.value, 10);
      if (isNaN(hoursWeek) || hoursWeek < 1) hoursWeek = 1;
      if (hoursWeek > 168) hoursWeek = 168;

      var hourlyValue = parseBrlCurrency(hourlyInput.value);
      if (hourlyValue < 0) hourlyValue = 0;
      if (hourlyValue > 100000) hourlyValue = 100000;

      var monthlyHours = Math.round(hoursWeek * people * 4.33);
      var yearlyHours = Math.round(hoursWeek * people * 52);
      var monthlyCost = monthlyHours * hourlyValue;
      var yearlyCost = yearlyHours * hourlyValue;

      hoursValueLabel.textContent = hoursWeek + 'h';
      peopleDisplay.textContent = String(people);
      yearlyHoursEl.textContent = String(yearlyHours);
      monthlyHoursEl.textContent = monthlyHours + ' horas';
      monthlyCostEl.textContent = formatCurrencyBrl(monthlyCost);
      yearlyCostEl.textContent = formatCurrencyBrl(yearlyCost);
    }

    hoursInput.addEventListener('input', updateCalculator);
    hourlyInput.addEventListener('input', updateCalculator);

    peopleDecrease.addEventListener('click', function () {
      people = Math.max(1, people - 1);
      updateCalculator();
    });

    peopleIncrease.addEventListener('click', function () {
      people = Math.min(MAX_PEOPLE, people + 1);
      updateCalculator();
    });

    updateCalculator();
  }

  /**
   * Inicializa o FAQ interativo com acessibilidade.
   */
  function initFaq() {
    var faqArticles = document.querySelectorAll('.faq-list article');
    if (!faqArticles.length) return;

    faqArticles.forEach(function (article, index) {
      var button = article.querySelector('button');
      var content = article.querySelector('[role="region"]');
      var symbol = button ? button.querySelector('b') : null;
      if (!button || !content) return;

      button.addEventListener('click', function () {
        var isOpen = article.classList.contains('open');

        if (isOpen) {
          article.classList.remove('open');
          button.setAttribute('aria-expanded', 'false');
          content.setAttribute('hidden', '');
          if (symbol) symbol.textContent = '+';
        } else {
          article.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
          content.removeAttribute('hidden');
          if (symbol) symbol.textContent = '−';
        }
      });

      button.addEventListener('keydown', function (event) {
        var total = faqArticles.length;
        var nextIndex;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            nextIndex = (index + 1) % total;
            faqArticles[nextIndex].querySelector('button').focus();
            break;
          case 'ArrowUp':
            event.preventDefault();
            nextIndex = (index - 1 + total) % total;
            faqArticles[nextIndex].querySelector('button').focus();
            break;
          case 'Home':
            event.preventDefault();
            faqArticles[0].querySelector('button').focus();
            break;
          case 'End':
            event.preventDefault();
            faqArticles[faqArticles.length - 1].querySelector('button').focus();
            break;
        }
      });
    });
  }

  /**
   * Inicializa o seletor de personagem RUB / ANA.
   */
  function initAgentToggle() {
    var toggleRub = document.getElementById('agent-toggle-rub');
    var toggleAna = document.getElementById('agent-toggle-ana');
    var statusName = document.getElementById('agent-status-name');

    if (!toggleRub || !toggleAna || !statusName) return;

    function setActive(selectedButton, otherButton, name) {
      selectedButton.classList.add('active');
      otherButton.classList.remove('active');
      selectedButton.setAttribute('aria-pressed', 'true');
      otherButton.setAttribute('aria-pressed', 'false');
      statusName.textContent = name;
    }

    toggleRub.addEventListener('click', function () {
      setActive(toggleRub, toggleAna, 'RUB');
    });

    toggleAna.addEventListener('click', function () {
      setActive(toggleAna, toggleRub, 'ANA');
    });
  }

  /**
   * Inicializa a revelação de seções via IntersectionObserver.
   * Fallback: se IO não existir, mostra todas imediatamente.
   */
  function initSectionReveal() {
    var sections = document.querySelectorAll('.section, .pain-strip, .final-cta');
    if (!sections.length) return;

    sections.forEach(function (section) {
      section.classList.add('reveal');
    });

    if (typeof IntersectionObserver !== 'function') {
      document.documentElement.classList.add('no-io');
      sections.forEach(function (section) {
        section.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /**
   * Inicializa o diagnóstico de 3 perguntas com pontuação por perfil
   * e exibe a recomendação com compatibilidade dos perfis.
   */
  function initDiagnostic() {
    var form = document.getElementById('diagnostic-form');
    var result = document.getElementById('diagnostic-result');
    var error = document.getElementById('diagnostic-error');
    var badge = document.getElementById('diagnostic-badge');
    var title = document.getElementById('diagnostic-title');
    var description = document.getElementById('diagnostic-description');
    var matchList = document.getElementById('diagnostic-match');
    var actions = document.getElementById('diagnostic-actions');
    var whatsapp = document.getElementById('diagnostic-whatsapp');
    var reset = document.getElementById('diagnostic-reset');
    var panel = document.getElementById('diagnostic-panel');
    var closeBtn = document.getElementById('diagnostic-close');
    var steps = form.querySelectorAll('.diagnostic-step');
    var progressList = document.querySelector('.diagnostic-progress');
    var prevBtn = document.getElementById('diagnostic-prev');
    var step2Title = document.getElementById('step-title-2');
    var step2Options = form.querySelector('[data-step-name="context"]');
    var step3Title = document.getElementById('step-title-3');
    var step3Options = form.querySelector('[data-step-name="goal"]');

    if (!form || !result || !error || !badge || !title || !description ||
      !matchList || !actions || !whatsapp || !reset ||
      !panel || !closeBtn || !prevBtn ||
      !step2Title || !step2Options || !step3Title || !step3Options) return;

    var PROFILE_KEYS = ['atendimento', 'comercial', 'financeiro', 'produtividade', 'conhecimento'];

    var profiles = {
      atendimento: {
        badge: 'Perfil 01',
        title: 'Agente de Atendimento e Relacionamento',
        description: 'Indicado para empresas que perdem tempo e clientes com mensagens sem resposta, atendimento inconsistente ou histórico de conversas espalhado em vários canais.',
        actions: [
          'Responder perguntas recorrentes de forma padrão e personalizada',
          'Qualificar e organizar históricos de conversa no funil',
          'Encaminhar casos complexos para a pessoa responsável'
        ]
      },
      comercial: {
        badge: 'Perfil 02',
        title: 'Agente Comercial e de Crescimento',
        description: 'Focado em oportunidades: lembra follow-ups, organiza o pipeline e dá velocidade para transformar contatos em negócios fechados.',
        actions: [
          'Qualificar novos contatos e perguntas iniciais',
          'Lembrar follow-up e preparar materiais de proposta',
          'Atualizar o CRM com resumos das conversas'
        ]
      },
      financeiro: {
        badge: 'Perfil 03',
        title: 'Agente de Gestão Financeira',
        description: 'Apoia a rotina financeira: concentra lançamentos, sinaliza vencimentos e entrega resumos claros para decisão sem surpresas.',
        actions: [
          'Registrar e categorizar movimentações com regra do negócio',
          'Alertar sobre contas a pagar, receber e vencimentos',
          'Entregar resumos semanais de caixa e projeções'
        ]
      },
      produtividade: {
        badge: 'Perfil 04',
        title: 'Agente de Produtividade e Operações',
        description: 'Perfil operacional: organiza agenda, prioriza tarefas e reduz retrabalho em equipes com rotina cheia e prioridades dispersas.',
        actions: [
          'Organizar compromissos, lembretes e prazo de tarefas',
          'Montar plano de prioridades para a semana',
          'Entregar resumo diário do que foi feito e do que vem aí'
        ]
      },
      conhecimento: {
        badge: 'Perfil 05',
        title: 'Agente de Conhecimento e Documentos',
        description: 'Indicado para empresas que perdem tempo procurando informação: reúne documentos, processos e manuais em uma base consultável e prática.',
        actions: [
          'Pesquisar informações em PDFs, planilhas e pastas',
          'Resumir documentos longos e contratos',
          'Criar relatórios, minutas e respostas baseadas no histórico'
        ]
      }
    };

    // Perguntas ramificadas por resposta do passo anterior:
    // Passo 2 depende da resposta do passo 1 (nome do name da radio = painKey)
    var contextByPain = {
      atendimento: {
        title: 'Hoje, como fica o atendimento ao cliente na sua empresa?',
        name: 'context_atendimento',
        options: [
          { value: 'multicanal', label: 'WhatsApp, Instagram, e-mail e telefone — tudo entra ao mesmo tempo',
            weights: { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 2, conhecimento: 0 } },
          { value: 'whatsapp', label: 'Só WhatsApp, mas a equipe não consegue responder a tempo',
            weights: { atendimento: 3, comercial: 2, financeiro: 0, produtividade: 1, conhecimento: 0 } },
          { value: 'padrao', label: 'Temos um fluxo, mas o padrão varia conforme quem atende',
            weights: { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 2, conhecimento: 1 } },
          { value: 'historico', label: 'Falta histórico do cliente na hora de resolver o problema',
            weights: { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 0, conhecimento: 2 } }
        ]
      },
      vendas: {
        title: 'Como está o acompanhamento de vendas hoje?',
        name: 'context_vendas',
        options: [
          { value: 'leads', label: 'Chegam muitos leads, mas a equipe não consegue acompanhar',
            weights: { atendimento: 1, comercial: 3, financeiro: 0, produtividade: 2, conhecimento: 0 } },
          { value: 'followup', label: 'Perde oportunidade porque esquece follow-up e retorno',
            weights: { atendimento: 0, comercial: 3, financeiro: 0, produtividade: 2, conhecimento: 0 } },
          { value: 'crm', label: 'Temos CRM, mas ninguém atualiza direito',
            weights: { atendimento: 0, comercial: 3, financeiro: 1, produtividade: 2, conhecimento: 0 } },
          { value: 'proposta', label: 'A proposta demora a sair e a resposta do cliente se perde',
            weights: { atendimento: 0, comercial: 3, financeiro: 1, produtividade: 1, conhecimento: 1 } }
        ]
      },
      financeiro: {
        title: 'Qual a dor mais forte na rotina financeira hoje?',
        name: 'context_financeiro',
        options: [
          { value: 'caixa', label: 'Caixa confuso, não tem visão do que entra e sai',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 2, conhecimento: 0 } },
          { value: 'vencimentos', label: 'Vencimentos passam e só vê depois que tem multa',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 2, conhecimento: 0 } },
          { value: 'lancamentos', label: 'Muito lançamento manual e muita planilha aberta',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 3, conhecimento: 0 } },
          { value: 'notas', label: 'Perde nota, boleto e comprovante na hora do fechamento',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 1, conhecimento: 2 } }
        ]
      },
      agenda: {
        title: 'O que mais atrapalha a produtividade da equipe hoje?',
        name: 'context_agenda',
        options: [
          { value: 'reuniao', label: 'Muitas reuniões, mas pouca decisão tomada',
            weights: { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 3, conhecimento: 1 } },
          { value: 'tarefa', label: 'Tarefas espalhadas e ninguém sabe o que priorizar',
            weights: { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 3, conhecimento: 1 } },
          { value: 'rotina', label: 'Falta rotina clara — cada um faz do seu jeito',
            weights: { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 3, conhecimento: 2 } },
          { value: 'retrabalho', label: 'Muito retrabalho porque o processo muda toda hora',
            weights: { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 3, conhecimento: 2 } }
        ]
      },
      documentos: {
        title: 'Qual tipo de informação vocês mais perdem tempo procurando?',
        name: 'context_documentos',
        options: [
          { value: 'contrato', label: 'Contratos, cláusulas e documentos de clientes',
            weights: { atendimento: 0, comercial: 1, financeiro: 1, produtividade: 0, conhecimento: 3 } },
          { value: 'processo', label: 'Processos internos, manuais e SOPs da empresa',
            weights: { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 2, conhecimento: 3 } },
          { value: 'pdf', label: 'PDFs longos, planilhas e relatórios antigos',
            weights: { atendimento: 0, comercial: 0, financeiro: 1, produtividade: 1, conhecimento: 3 } },
          { value: 'historico', label: 'Histórico e decisões de reuniões passadas',
            weights: { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 2, conhecimento: 3 } }
        ]
      }
    };

    // Passo 3 depende da resposta do passo 1 + passo 2.
    // A chave é a resposta do passo 1 (painKey)
    var goalByPain = {
      atendimento: {
        title: 'Qual resultado você quer ver nos próximos 90 dias?',
        name: 'goal_atendimento',
        options: [
          { value: 'tempo_resposta', label: 'Reduzir o tempo de resposta sem perder qualidade',
            weights: { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 2, conhecimento: 0 } },
          { value: 'qualificacao', label: 'Qualificar melhor quem entra antes da equipe conversar',
            weights: { atendimento: 3, comercial: 2, financeiro: 0, produtividade: 0, conhecimento: 0 } },
          { value: 'padrao', label: 'Ter um padrão de atendimento, independente de quem atende',
            weights: { atendimento: 3, comercial: 0, financeiro: 0, produtividade: 2, conhecimento: 1 } },
          { value: 'historico', label: 'Ter histórico do cliente organizado para todo mundo consultar',
            weights: { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 0, conhecimento: 2 } }
        ]
      },
      vendas: {
        title: 'Qual resultado você quer ver nos próximos 90 dias?',
        name: 'goal_vendas',
        options: [
          { value: 'fechamento', label: 'Mais velocidade no fechamento e no follow-up',
            weights: { atendimento: 0, comercial: 3, financeiro: 1, produtividade: 2, conhecimento: 0 } },
          { value: 'funil', label: 'Ter o funil sempre atualizado sem depender de ninguém',
            weights: { atendimento: 0, comercial: 3, financeiro: 0, produtividade: 2, conhecimento: 0 } },
          { value: 'proposta', label: 'Sair proposta profissional e rápido',
            weights: { atendimento: 0, comercial: 3, financeiro: 1, produtividade: 1, conhecimento: 1 } },
          { value: 'taxa', label: 'Aumentar a taxa de conversão de oportunidades quentes',
            weights: { atendimento: 0, comercial: 3, financeiro: 0, produtividade: 1, conhecimento: 0 } }
        ]
      },
      financeiro: {
        title: 'Qual resultado você quer ver nos próximos 90 dias?',
        name: 'goal_financeiro',
        options: [
          { value: 'previsibilidade', label: 'Previsibilidade de caixa sem surpresas',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 1, conhecimento: 0 } },
          { value: 'sem_multas', label: 'Não pagar multa por vencimento esquecido',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 2, conhecimento: 0 } },
          { value: 'visao', label: 'Ter visão consolidada sem ficar abrindo 10 planilhas',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 2, conhecimento: 1 } },
          { value: 'fechamento', label: 'Fazer fechamento mensal mais rápido e confiável',
            weights: { atendimento: 0, comercial: 0, financeiro: 3, produtividade: 2, conhecimento: 1 } }
        ]
      },
      agenda: {
        title: 'Qual resultado você quer ver nos próximos 90 dias?',
        name: 'goal_agenda',
        options: [
          { value: 'prioridade', label: 'Equipe saber sempre o que priorizar no dia',
            weights: { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 3, conhecimento: 0 } },
          { value: 'rotina', label: 'Ter rotina clara e padronizada para a equipe',
            weights: { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 3, conhecimento: 2 } },
          { value: 'retrabalho', label: 'Reduzir retrabalho operacional',
            weights: { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 3, conhecimento: 1 } },
          { value: 'status', label: 'Ter visibilidade do status das tarefas em tempo real',
            weights: { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 3, conhecimento: 1 } }
        ]
      },
      documentos: {
        title: 'Qual resultado você quer ver nos próximos 90 dias?',
        name: 'goal_documentos',
        options: [
          { value: 'acesso', label: 'Qualquer pessoa ter acesso rápido à informação certa',
            weights: { atendimento: 1, comercial: 1, financeiro: 0, produtividade: 1, conhecimento: 3 } },
          { value: 'resumo', label: 'Resumir documento longo em minutos sem ler tudo',
            weights: { atendimento: 0, comercial: 1, financeiro: 1, produtividade: 1, conhecimento: 3 } },
          { value: 'decisao', label: 'Decidir com base na informação e não na memória',
            weights: { atendimento: 0, comercial: 1, financeiro: 1, produtividade: 1, conhecimento: 3 } },
          { value: 'organizado', label: 'Ter documentos organizados sem caçar e-mail atrás de e-mail',
            weights: { atendimento: 0, comercial: 0, financeiro: 1, produtividade: 2, conhecimento: 3 } }
        ]
      }
    };

    var currentStep = 1; // 1, 2, 3

    function clearScores() {
      var scores = {};
      PROFILE_KEYS.forEach(function (key) { scores[key] = 0; });
      return scores;
    }

    function addScoresByWeights(scores, weights) {
      if (!weights) return;
      PROFILE_KEYS.forEach(function (key) {
        scores[key] = scores[key] + (weights[key] || 0);
      });
    }

    function getScores() {
      var painRadio = form.querySelector('input[name="pain"]:checked');
      var painKey = painRadio ? painRadio.value : null;
      if (!painKey || !contextByPain[painKey]) return null;

      var ctxName = contextByPain[painKey].name;
      var ctxRadio = form.querySelector('input[name="' + ctxName + '"]:checked');
      if (!ctxRadio) return null;

      var goal = goalByPain[painKey];
      var goalRadio = form.querySelector('input[name="' + goal.name + '"]:checked');
      if (!goalRadio) return null;

      var scores = clearScores();
      var ctxOption = null;
      var goalOption = null;
      contextByPain[painKey].options.forEach(function (o) {
        if (o.value === ctxRadio.value) ctxOption = o;
      });
      goal.options.forEach(function (o) {
        if (o.value === goalRadio.value) goalOption = o;
      });

      // Passo 1 (pain): soma pesos da resposta como antes
      var painWeights = {
        atendimento:  { atendimento: 3, comercial: 1, financeiro: 0, produtividade: 1, conhecimento: 1 },
        vendas:       { atendimento: 1, comercial: 3, financeiro: 1, produtividade: 1, conhecimento: 0 },
        financeiro:   { atendimento: 0, comercial: 1, financeiro: 3, produtividade: 1, conhecimento: 1 },
        agenda:       { atendimento: 0, comercial: 1, financeiro: 0, produtividade: 3, conhecimento: 1 },
        documentos:   { atendimento: 0, comercial: 0, financeiro: 0, produtividade: 1, conhecimento: 3 }
      };
      addScoresByWeights(scores, painWeights[painKey]);
      addScoresByWeights(scores, ctxOption ? ctxOption.weights : null);
      addScoresByWeights(scores, goalOption ? goalOption.weights : null);
      return scores;
    }

    function rankScores(scores) {
      var total = 0;
      PROFILE_KEYS.forEach(function (key) { total += scores[key]; });
      var ranked = PROFILE_KEYS.map(function (key) {
        var raw = scores[key];
        return {
          key: key,
          score: raw,
          percent: total ? Math.max(8, Math.round((raw / total) * 100)) : 0
        };
      });
      ranked.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.key.localeCompare(b.key);
      });
      return ranked;
    }

    function renderStep(stepNum) {
      steps.forEach(function (stepEl, idx) {
        var i = idx + 1;
        stepEl.classList.remove('is-active', 'is-done');
        if (i < stepNum) {
          stepEl.classList.add('is-done');
          stepEl.hidden = true;
        } else if (i === stepNum) {
          stepEl.classList.add('is-active');
          stepEl.hidden = false;
        } else {
          stepEl.hidden = true;
        }
      });

      if (progressList) {
        progressList.setAttribute('data-step', String(stepNum));
        var progressItems = progressList.querySelectorAll('li');
        progressItems.forEach(function (item, idx) {
          var n = idx + 1;
          item.classList.remove('is-active', 'is-done');
          if (n === stepNum) {
            item.classList.add('is-active');
          } else if (n < stepNum) {
            item.classList.add('is-done');
          }
        });
      }

      prevBtn.hidden = (stepNum === 1);
      prevBtn.disabled = (stepNum === 1);
    }

    function populateStep2(painKey) {
      var cfg = contextByPain[painKey];
      if (!cfg) return;

      step2Title.textContent = cfg.title;
      step2Options.innerHTML = '';
      step2Options.removeAttribute('data-name-cleared');

      cfg.options.forEach(function (opt) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = cfg.name;
        input.value = opt.value;
        var span = document.createElement('span');
        span.textContent = opt.label;
        label.appendChild(input);
        label.appendChild(span);
        step2Options.appendChild(label);

        input.addEventListener('change', clearError);
      });
    }

    function populateStep3(painKey) {
      var cfg = goalByPain[painKey];
      if (!cfg) return;

      step3Title.textContent = cfg.title;
      step3Options.innerHTML = '';
      cfg.options.forEach(function (opt) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = cfg.name;
        input.value = opt.value;
        var span = document.createElement('span');
        span.textContent = opt.label;
        label.appendChild(input);
        label.appendChild(span);
        step3Options.appendChild(label);

        input.addEventListener('change', clearError);
      });
    }

    function focusFirstRadioInStep(stepNum) {
      var stepEl = steps[stepNum - 1];
      if (!stepEl) return;
      var first = stepEl.querySelector('input[type="radio"]');
      if (first) first.focus();
    }

    function validateCurrentStep() {
      var stepEl = steps[currentStep - 1];
      if (!stepEl) return { ok: false };
      var checked = stepEl.querySelector('input[type="radio"]:checked');
      if (checked) return { ok: true };
      return { ok: false, step: currentStep };
    }

    function showError(msg) {
      error.textContent = msg;
      error.hidden = false;
    }

    function clearError() {
      error.textContent = '';
      error.hidden = true;
    }

    function renderActions(listEl, actionList) {
      listEl.textContent = '';
      actionList.forEach(function (a) {
        var li = document.createElement('li');
        li.textContent = a;
        listEl.appendChild(li);
      });
    }

    function renderMatch(listEl, ranked, winnerKey) {
      listEl.textContent = '';
      var SHORT = {
        atendimento: 'Atendimento',
        comercial: 'Comercial',
        financeiro: 'Financeiro',
        produtividade: 'Operações',
        conhecimento: 'Conhecimento'
      };
      ranked.forEach(function (entry) {
        var li = document.createElement('li');
        var label = document.createElement('strong');
        label.textContent = SHORT[entry.key] || profiles[entry.key].title;
        if (entry.key === winnerKey) {
          label.textContent = label.textContent + ' (rec.)';
        }

        var barWrap = document.createElement('span');
        barWrap.className = 'match-bar';
        barWrap.setAttribute('aria-hidden', 'true');
        var barFill = document.createElement('span');
        barFill.style.width = entry.percent + '%';
        barWrap.appendChild(barFill);

        var percent = document.createElement('span');
        percent.textContent = entry.percent + '%';
        percent.style.cssText = 'min-width:36px;text-align:right;color:#9aadb7;font-weight:600;';

        li.appendChild(label);
        li.appendChild(percent);
        li.appendChild(barWrap);
        listEl.appendChild(li);
      });
    }

    function showRecommendation(ranked) {
      var winner = profiles[ranked[0].key];

      badge.textContent = winner.badge;
      title.textContent = winner.title;
      description.textContent = winner.description;
      renderActions(actions, winner.actions);
      renderMatch(matchList, ranked, ranked[0].key);

      var msg = 'Olá! Fiz o diagnóstico no AgentRub e o perfil recomendado foi: ' +
        winner.title + '. Gostaria de entender como aplicar isso na minha empresa.';
      whatsapp.href = 'https://wa.me/5549991191991?text=' + encodeURIComponent(msg);

      openResult();
    }

    /**
     * Abre o resultado como um modal ancorado exatamente sobre as perguntas:
     * o formulário continua no fluxo (segurando a altura do card) e fica
     * desfocado + inerte ao fundo.
     */
    function openResult() {
      // O painel assume a altura das perguntas e o modal abre exatamente ali.
      panel.style.minHeight = Math.max(form.offsetHeight, 420) + 'px';
      panel.classList.add('is-result');
      if ('inert' in HTMLElement.prototype) {
        form.inert = true;
      } else {
        form.hidden = true;
      }
      result.hidden = false;
      fitPanelToResult();
      result.focus({ preventScroll: true });
      if (typeof panel.scrollIntoView === 'function') {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    /**
     * Cresce o painel só o suficiente para o resultado caber, respeitando um
     * teto (nunca maior que 80% da tela) — assim o modal não vira um card
     * gigante e o conteúdo extra rola dentro dele.
     */
    function fitPanelToResult() {
      var card = result.querySelector('.result-card');
      if (!card) return;
      var veilPadding = 24;
      var cap = Math.min(620, Math.round(window.innerHeight * 0.8));
      var needed = card.scrollHeight + veilPadding;
      panel.style.minHeight =
        Math.min(Math.max(form.offsetHeight, needed), cap) + 'px';
    }

    function closeResult() {
      result.hidden = true;
      panel.classList.remove('is-result');
      panel.style.minHeight = '';
      if ('inert' in HTMLElement.prototype) {
        form.inert = false;
      } else {
        form.hidden = false;
      }
    }

    function submitCurrentAnswers() {
      clearError();
      var painRadio = form.querySelector('input[name="pain"]:checked');
      if (!painRadio) {
        showError('Responda as 3 perguntas para gerar o perfil recomendado.');
        currentStep = 1; renderStep(1); focusFirstRadioInStep(1);
        return;
      }
      var painKey = painRadio.value;
      var ctxName = contextByPain[painKey].name;
      var ctxRadio = form.querySelector('input[name="' + ctxName + '"]:checked');
      if (!ctxRadio) {
        showError('Responda a pergunta 02 (sobre a sua operação atual).');
        currentStep = 2; renderStep(2); focusFirstRadioInStep(2);
        return;
      }
      var goal = goalByPain[painKey];
      var goalRadio = form.querySelector('input[name="' + goal.name + '"]:checked');
      if (!goalRadio) {
        showError('Responda a pergunta 03 (sobre o seu objetivo).');
        currentStep = 3; renderStep(3); focusFirstRadioInStep(3);
        return;
      }
      var scores = getScores();
      if (!scores) {
        showError('Não foi possível processar suas respostas. Tente novamente.');
        return;
      }
      var ranked = rankScores(scores);
      showRecommendation(ranked);
    }

    form.querySelector('input[name="pain"]').closest('.diagnostic-options')
      .addEventListener('change', function () {
        clearError();
        var painRadio = form.querySelector('input[name="pain"]:checked');
        if (!painRadio) return;
        var painKey = painRadio.value;
        step2Options.innerHTML = '';
        step3Options.innerHTML = '';
        populateStep2(painKey);
        populateStep3(painKey);
        currentStep = 2;
        renderStep(currentStep);
        focusFirstRadioInStep(currentStep);
      });

    step2Options.addEventListener('change', function () {
      clearError();
      var checked = step2Options.querySelector('input[type="radio"]:checked');
      if (!checked) return;
      currentStep = 3;
      renderStep(currentStep);
      focusFirstRadioInStep(currentStep);
    });

    step3Options.addEventListener('change', function () {
      clearError();
      var checked = step3Options.querySelector('input[type="radio"]:checked');
      if (!checked) return;
      submitCurrentAnswers();
    });

    prevBtn.addEventListener('click', function () {
      clearError();
      if (currentStep > 1) {
        currentStep = currentStep - 1;
        renderStep(currentStep);
        focusFirstRadioInStep(currentStep);
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitCurrentAnswers();
    });

    function restartDiagnostic() {
      form.reset();
      closeResult();
      clearError();
      currentStep = 1;
      // Reseta passos 2 e 3 (serão preenchidos de novo quando o passo 1 for marcado)
      step2Options.innerHTML = '';
      step3Options.innerHTML = '';
      renderStep(currentStep);
      focusFirstRadioInStep(1);
    }

    reset.addEventListener('click', restartDiagnostic);
    closeBtn.addEventListener('click', restartDiagnostic);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !result.hidden) restartDiagnostic();
    });

    window.addEventListener('resize', function () {
      if (!result.hidden) fitPanelToResult();
    });

    // Inicializa estados visuais
    renderStep(currentStep);
  }

  /**
   * Boot: inicializa todos os módulos após o DOM estar pronto.
   */
  function boot() {
    initCalculator();
    initFaq();
    initAgentToggle();
    initDiagnostic();
    initSectionReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
