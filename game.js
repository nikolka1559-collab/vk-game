// game.js

(function() {
  const root = document.getElementById('root');

  function setStatus(text, className) {
    if (!root) return;
    root.innerHTML = `<p class="status-text ${className || ''}">${text}</p>`;
  }

  // 1. Сначала проверяем, что vkBridge вообще есть и это объект
  if (typeof vkBridge === 'undefined' || typeof vkBridge !== 'object') {
    console.error('❌ vkBridge не найден или это не объект!');
    setStatus('❌ VK Bridge не найден. Проверьте подключение скрипта в index.html.', 'error');
    return;
  }

  // 2. Проверяем, есть ли метод load (защита от битых версий)
  if (typeof vkBridge.load !== 'function') {
    console.error('❌ У vkBridge нет метода .load(). Это не официальная версия библиотеки.');
    setStatus('❌ Ошибка VK Bridge: нет метода load(). Проверьте версию библиотеки.', 'error');
    return;
  }

  setStatus('⏳ Ожидание готовности VK Bridge…', 'loading');

  // 3. Теперь безопасно вызываем .load()
  vkBridge
    .load()
    .then((status) => {
      if (status === 'ok') {
        console.log('✅ VK Bridge загружен. Отправляем VKWebAppInit…');
        setStatus('✅ Отправка VKWebAppInit…', 'success');

        // 4. Отправляем обязательный запрос инициализации
        vkBridge.send('VKWebAppInit');

        // 5. Слушаем ответ
        vkBridge.subscribe((e) => {
          if (e.detail.type === 'VKWebAppInitResult') {
            const data = e.detail.data;
            console.log('🚀 VKWebAppInitResult:', data);
            setStatus(`✅ Приложение запущено!<br>vk_app_id: ${data.vk_app_id}<br>vk_user_id: ${data.vk_user_id}`, 'success');

            // --- ЗДЕСЬ НАЧИНАЕТСЯ ТВОЯ ЛОГИКА ИГРЫ ---
            // startGame();
            // -------------------------------------------
          }
        });
      } else {
        console.error('❌ VK Bridge вернул статус:', status);
        setStatus(`❌ VK Bridge не готов: ${status}`, 'error');
      }
    })
    .catch((error) => {
      console.error('❌ Ошибка при загрузке VK Bridge:', error);
      setStatus('❌ Ошибка загрузки VK Bridge. См. консоль.', 'error');
    });
})();
