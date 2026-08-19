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
   * Boot: inicializa todos os módulos após o DOM estar pronto.
   */
  function boot() {
    initCalculator();
    initFaq();
    initAgentToggle();
    initSectionReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
