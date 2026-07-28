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
    quote: "Человек — это звучит гордо!",
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
  }
];

let score = 0;
let round = 0;
const maxRounds = 10;

const root = document.getElementById('root');

function renderStartScreen() {
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Битва цитат</h1>
      <p>Угадай, кто сказал эту фразу</p>
      <button id="startBtn" style="padding: 14px 24px; font-size: 16px;">Начать игру</button>
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
    <div style="padding: 16px;">
      <div class="quote-box">
        <div class="quote-text">«${item.quote}»</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${options.map(opt => `
          <button
            class="option-btn"
            style="padding: 12px; font-size: 15px; border: 1px solid #ccc; border-radius: 8px;"
            data-author="${opt}"
            data-correct="${opt === item.author}"
          >
            ${opt}
          </button>
        `).join('')}
      </div>
      <div style="margin-top: 20px; font-size: 16px;">
        Раунд ${round + 1} из ${maxRounds} • Очки: ${score}
      </div>
    </div>
  `;

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn, item.author));
  });
}

function handleAnswer(btn, correctAuthor) {
  const selectedAuthor = btn.getAttribute('data-author');
  const isCorrect = selectedAuthor === correctAuthor;

  if (isCorrect) {
    score += 1;
    btn.style.backgroundColor = '#4caf50';
    btn.style.color = '#fff';
  } else {
    btn.style.backgroundColor = '#f44336';
    btn.style.color = '#fff';
    // подсветить правильный
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.getAttribute('data-author') === correctAuthor) {
        b.style.backgroundColor = '#2196f3';
        b.style.color = '#fff';
      }
    });
  }

  // блокировка кнопок
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  setTimeout(() => {
    round++;
    nextRound();
  }, 1500);
}

function renderEndScreen() {
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Игра окончена!</h2>
      <p>Вы набрали: <b>${score} из ${maxRounds}</b></p>
      ${score === maxRounds ? '<p>🎉 Отличный результат!</p>' : ''}
      <button id="restartBtn" style="margin-top: 16px; padding: 12px 24px;">Сыграть ещё</button>
    </div>
  `;
  document.getElementById('restartBtn').addEventListener('click', startGame);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Инициализация VK Bridge (опционально для полноценной интеграции)
vkBridge
  .load()
  .then(() => {
    vkBridge.send('VKWebAppInit');
    renderStartScreen();
  })
  .catch(err => {
    console.error('VK Bridge не загрузился', err);
    // Для отладки вне ВК можно всё равно запустить игру
    renderStartScreen();
  });


// Старт
renderStartScreen();
