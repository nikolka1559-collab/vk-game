const GROUP_ID = 54697683; // Вставь сюда ID своей группы (если не тот)

const db = {
    "work": [
        "Дедлайн горит, а я только разогреваюсь. 🔥",
        "Мой KPI: успеть выпить кофе до совещания. ☕",
        "Работа — это когда ты знаешь, что можешь лучше, но уже 18:00. 🌙",
        "Я не отвлекаюсь, я собираю контекст. 🧠",
        "План на день: выжить. 🎯",
        "В таск-трекере 100 задач, а я читаю эту строчку. 😵‍💫",
        "Когда начальник пишет «срочно», у меня автоматически снижается скорость. 🐢",
        "Совещание: 40 минут говорим, 2 минуты делаем. 🗣️",
        "У меня не баг, у меня фича. 🛠️",
        "Пятница начинается в среду. 😌"
    ],
    "life": [
        "Счастье — это когда никто не трогает твой кофе. ☕",
        "Взрослая жизнь: когда «хочу спать» — это хобби. 😴",
        "Лучший отдых — лежать и не думать. 😌",
        "Мои планы: ничего не планировать. 📅",
        "Если не торопиться, день проходит спокойнее. 🧘",
        "Иногда лучший выбор — вообще не выбирать. 🤷",
        "Дом — это место, где можно не притворяться бодрым. 🏠",
        "Тишина — мой любимый звук. 🔇",
        "Сегодня я выбираю быть ленивым и горжусь этим. 😎",
        "День прошёл нормально, если ничего не сломалось. ✅"
    ],
    "philosophy": [
        "Мудрость — это знать, когда не надо ничего делать. 🦉",
        "Время идёт, а я всё ещё в поиске себя. 🚶‍♂️",
        "Смысл жизни: найти Wi‑Fi и выдохнуть. 📶",
        "Чем меньше знаешь, тем крепче спишь. 💤",
        "Не всё, что можно исправить, нужно исправлять. ⚖️",
        "Жизнь — это баг, который мы пытаемся пофиксить. 🐞",
        "Самое сложное — не усложнять. 🧩",
        "Иногда тишина говорит громче слов. 🤫",
        "Прогресс — это когда сегодня ты чуть меньше устал. 🌱",
        "Спокойствие — это когда тебя никто не дёргает. 🕊️"
    ],
    "games": [
        "Прошёл уровень, но потерял веру в себя. 🎮",
        "Критический промах: уронил геймпад. 🎮💥",
        "Ещё один рейд — и я либо стану легендой, либо уйду в офлайн навсегда. 🛡️",
        "Сложность «Hard»: даже меню не хочет открываться. 🖥️",
        "Лут: ноль, нервы: минус. 🎒",
        "Когда игра говорит «ты справишься», она врёт. 😈",
        "Победа: когда игра наконец перестала вылетать. 🏆",
        "Таймер тикает, а я выбираю экипировку. ⏳",
        "Босс не такой страшный, как пинг. 👹",
        "Главное — не потерять сейв. 💾"
    ],
    "tech": [
        "Код компилируется, но я не верю. 💻",
        "Ошибка 404: мотивация не найдена. 🔍",
        "Git: я сделал commit, но не помню зачем. 🤖",
        "Сервер молчит — значит, всё сломалось. 📡",
        "API отвечает, но на своём языке. 🌐",
        "Frontend и Backend наконец договорились — и тут упал CI. 🏗️",
        "Тестирование: найти баг, который ты сам и написал. 🐛",
        "Документация: есть, но она про другую версию. 📖",
        "Оптимизация: сделать так, чтобы работало быстрее и выглядело сложнее. ⚡",
        "DevOps: когда ты не знаешь, где твой код, но он где-то работает. 🌀"
    ],
    "fun": [
        "Я не опаздываю, я тестирую дедлайны. ⏱️",
        "Моя продуктивность зависит от погоды и настроения кота. 🐱",
        "Кофе — это топливо, без него я просто человек. ☕🚀",
        "Если никто не заметил, значит, это была фича. 😉",
        "Лучший план — отсутствие плана. 🗺️",
        "Я не игнорирую сообщения, я в режиме энергосбережения. 🔋",
        "Сегодня день «попробую, но без гарантий». 🤞",
        "Мотивация приходит, когда уже всё сделано. 🏃‍♂️",
        "Секрет успеха: делать вид, что всё под контролем. 😎",
        "Я не застрял, я исследую варианты. 🧭"
    ]
};

let currentStatus = "";
let isSubscribed = false;
let myVkName = "Вы";
let userExp = parseInt(localStorage.getItem('status_app_global_exp')) || 0;
let userLevel = parseInt(localStorage.getItem('status_app_level')) || 1;

function safeGetElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Элемент #${id} не найден!`);
    return el;
}

function initApp() {
    if (typeof vkBridge === 'undefined') {
        console.warn("VK Bridge не обнаружен (запуск вне ВК)");
        fallbackInit();
        return;
    }

    vkBridge.send("VKWebAppInit")
        .then(() => {
            console.log("VK Bridge успешно инициализирован");
            getUserVkData();
            checkGroupSubscription();
            loadLeaderboard();
            generateStatus();
        })
        .catch(err => {
            console.error("Ошибка инициализации Bridge:", err);
            fallbackInit();
        });
}

function fallbackInit() {
    const userNameEl = safeGetElement("userName");
    const leaderboardEl = safeGetElement("leaderboardList");
    if (userNameEl) userNameEl.innerText = "Тестовый Игрок";
    if (leaderboardEl) leaderboardEl.innerHTML = '<div style="text-align:center; color:orange; font-size:12px;">Запущено вне ВК (демо-режим)</div>';
    updateStatsUI();
}

function getUserVkData() {
    vkBridge.send("VKWebAppGetUserInfo")
        .then(data => {
            if (data.first_name) {
                myVkName = `${data.first_name} ${data.last_name || ''}`.trim();
                const el = safeGetElement("userName");
                if (el) el.innerText = data.first_name;
                updateStatsUI();
                saveMyScore(); 
            }
        })
        .catch(() => {
            const el = safeGetElement("userName");
            if (el) el.innerText = "Игрок";
        });
}

function checkGroupSubscription() {
    vkBridge.send("VKWebAppGetGroupToken", { "group_id": GROUP_ID, "scope": "groups" })
        .then(() => { isSubscribed = true; })
        .catch(() => {});
}

async function requestSubscription() {
  try {
    await vkBridge.send("VKWebAppJoinGroup", {"group_id": GROUP_ID});
    isSubscribed = true;
    return true;
  } catch (e) {
    alert("Для генерации нужно подписаться на группу!");
    return false;
  }
}

function updateStatsUI() {
    const elLevel = safeGetElement("userLevel");
    const elExp = safeGetElement("userExp");
    if (elLevel) elLevel.innerText = userLevel;
    if (elExp) elExp.innerText = userExp;
}

function addExperience(amount) {
    userExp += amount;
    if (userExp >= 100) {
        userLevel += 1;
        userExp = userExp - 100;
        alert(`🎉 Новый уровень! Вы достигли ${userLevel} уровня!`);
    }
    localStorage.setItem('status_app_global_exp', userExp);
    localStorage.setItem('status_app_level', userLevel);
    updateStatsUI();
    if (typeof vkBridge !== 'undefined') saveMyScore();
}

function claimDailyBonus() {
    const lastBonus = localStorage.getItem('status_app_bonus_time');
    const now = new Date().getTime();
    if (lastBonus && (now - lastBonus < 86400000)) {
        alert("Бонус уже получен! Возвращайтесь завтра.");
        return;
    }
    localStorage.setItem('status_app_bonus_time', now);
    addExperience(30);
    const btn = safeGetElement("bonusBtn");
    if (btn) btn.style.display = "none";
}

function saveMyScore() {
    const totalScore = (userLevel * 100) + userExp;
    
    vkBridge.send("VKWebAppStorageGet", {"keys": ["global_leaderboard"]})
        .then(data => {
            let list = [];
            if(data.keys && data.keys[0] && data.keys[0].value) {
                try {
                    list = JSON.parse(data.keys[0].value);
                } catch (e) {
                    console.error("Не удалось распарсить лидерборд:", e);
                    list = [];
                }
            }
            
            list
