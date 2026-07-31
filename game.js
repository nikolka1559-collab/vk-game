// game.js

// 1. Проверяем, есть ли глобальный vkBridge (для мини‑аппов ВК)
if (typeof vkBridge !== 'undefined') {
  // 2. Сначала ждём готовности
  vkBridge
    .load()
    .then((status) => {
      if (status === 'ok') {
        console.log('✅ VK Bridge загружен. Отправляем VKWebAppInit...');
        vkBridge.send('VKWebAppInit');
      } else {
        console.error('❌ VK Bridge не готов:', status);
      }
    })
    .catch((error) => {
      console.error('❌ Ошибка VK Bridge:', error);
    });
} else {
  console.warn('⚠️ vkBridge не найден. Это не мини‑апп ВКонтакте или ошибка подключения скрипта.');
}

// Дальше тут будет твоя логика игры.
// Пока просто выведем сообщение, чтобы видеть, что код выполняется:
console.log('🚀 "Битва цитат" — инициализация завершена.');
