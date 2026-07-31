const quotesData = [
  {
    quote: "Быть или не быть — вот в чём вопрос.",
    author: "Уильям Шекспир",
    options: ["Лев Толстой", "Уильям Шекспир", "Фёдор Достоевский", "Антон Чехов"]
  },
  {
    quote: "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.",
    author: "Лев Толстой",
    options: ["Фёдор Достоевский", "Лев Толстой", "Иван Тургенев", "Александр Пушкин"]
  },
  {
    quote: "Человек — это звучит гордо!",
    author: "Максим Горький",
    options: ["Максим Горький", "Владимир Маяковский", "Сергей Есенин", "Михаил Булгаков"]
  },
  {
    quote: "Рукописи не горят.",
    author: "Михаил Булгаков",
    options: ["Михаил Булгаков", "Николай Гоголь", "Андрей Платонов", "Борис Пастернак"]
  },
  {
    quote: "Я помню чудное мгновенье: передо мной явилась ты…",
    author: "Александр Пушкин",
    options: ["Александр Пушкин", "Михаил Лермонтов", "Афанасий Фет", "Фёдор Тютчев"]
  },
  {
    quote: "Красота спасёт мир.",
    author: "Фёдор Достоевский",
    options: ["Лев Толстой", "Фёдор Достоевский", "Иван Гончаров", "Николай Чернышевский"]
  },
  {
    quote: "Мы в ответе за тех, кого приручили.",
    author: "Антуан де Сент-Экзюпери",
    options: ["Антуан де Сент-Экзюпери", "Рэй Брэдбери", "Марк Твен", "Джек Лондон"]
  }
];

let score = 0;
let round = 0;
const maxRounds = 10;

const root = document.getElementById('root');

function renderStartScreen() {
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="margin-bottom: 10px;">Битва цитат</h1>
      <p style="color: #666; margin-bottom: 30px;">Угадай, кто сказал эту фразу</p>
      <button id="startBtn" class="option-btn" style="width: 100%; padding: 16px; font-weight: bold;">
        Начать игру
      </button>
    </div>
  `;
  document.getElementById('startBtn').addEventListener('click', startGame);
}

function startGame() {
  score = 0;
  round = 0;
  nextRound();
}

function nextRound() {
  if (round >= maxRounds) {
    renderEndScreen();
    return;
  }

  const item = quotesData[Math.floor(Math.random() * quotesData.length)];
  const options = shuffleArray([...item.options]);

  root.innerHTML = `
    <div>
      <div class="quote-box">
        <p class="quote-text">«${item.quote}»</p>
      </div>
      
      <div class="options-grid">
        ${options.map(opt => `
          <button
            class="option-btn"
            data-author="${opt}"
            data-correct="${opt === item.author}"
            onclick="handleAnswer(this, '${item.author}')"
          >
            ${opt}
          </button>
        `).join('')}
      </div>

      <div class="progress-bar">
        Раунд ${round + 1} из ${maxRounds} • Очки: ${score}
      </div>
    </div>
  `;
}

window.handleAnswer = function(btn, correctAuthor) {
  const selectedAuthor = btn.getAttribute('data-author');
  const isCorrect = selectedAuthor === correctAuthor;

  if (isCorrect) {
    score += 1;
    btn.style.backgroundColor = '#4caf50';
    btn.style.color = '#fff';
    btn.textContent = '✅ Верно!';
  } else {
    btn.style.backgroundColor = '#f44336';
    btn.style.color = '#fff';
    btn.textContent = '❌ Неверно';
    
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.getAttribute('data-author') === correctAuthor) {
        b.style.backgroundColor = '#2196f3';
        b.style.color = '#fff';
        b.textContent = '🎯 Правильный ответ';
      }
    });
  }

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  setTimeout(() => {
    round++;
    nextRound();
  }, 1500);
};

function renderEndScreen() {
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Игра окончена!</h2>
      <p>Вы набрали: <b>${score} из ${maxRounds}</b></p>
      ${score === maxRounds ? '<p style="color: #4caf50;">🎉 Отличный результат!</p>' : ''}
      <br>
      <button id="restartBtn" class="option-btn" style="width: 100%; padding: 16px;">
        Сыграть ещё
      </button>
      <button id="closeBtn" class="option-btn" style="width: 100%; padding: 16px; margin-top: 10px; background: #eee;">
        Закрыть приложение
      </button>
    </div>
  `;

  document.getElementById('restartBtn').addEventListener('click', startGame);
  
  document.getElementById('closeBtn').addEventListener('click', () => {
    if (typeof vkBridge !== 'undefined' && vkBridge.send) {
      vkBridge.send('VKWebAppClose');
    }
  });
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ПРАВИЛЬНАЯ ИНИЦИАЛИЗАЦИЯ ДЛЯ VK MINI APP ---
(function init() {
  // vkBridge должен быть доступен глобально (подключается в index.html)
  if (typeof vkBridge === 'undefined') {
    console.warn('VK Bridge не найден. Запуск в режиме эмуляции (для тестов вне ВК).');
    // Эмуляция только для тестов в браузере
    window.vkBridge = {
      load: () => Promise.resolve(),
      send: (method, params) => {
        console.log('[VK Bridge Emulation] send:', method, params);
        if (method === 'VKWebAppClose') alert('Закрыть приложение (эмуляция)');
      },
      on: () => {},
      ready: () => Promise.resolve()
    };
  }

  // ГЛАВНОЕ: сначала загружаем мост, потом отправляем инициализацию
  vkBridge
    .load()
    .then(() => {
      console.log('VK Bridge загружен. Отправляем VKWebAppInit...');
      return vkBridge.send('VKWebAppInit');
    })
    .then(data => {
      console.log('✅ VKWebAppInit успешно отправлен:', data);
      renderStartScreen();
    })
    .catch(err => {
      console.error('❌ Ошибка инициализации VK Bridge:', err);
      // Даже при ошибке показываем интерфейс, чтобы не было белого экрана
      renderStartScreen();
    });
})();
