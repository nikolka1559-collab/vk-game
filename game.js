// game.js

(function() {
  const root = document.getElementById('root');

  function setStatus(text, className) {
    if (!root) return;
    root.innerHTML = `<p class="status-text ${className || ''}">${text}</p>`;
  }

  // Если vkBridge вообще нет — показываем ошибку
  if (typeof vkBridge === 'undefined') {
    console.error('❌ vkBridge не найден');
    setStatus('❌ VK Bridge не найден. Проверьте подключение в index.html.', 'error');
    return;
  }

  setStatus('⏳ Инициализация…', 'loading');

  // Отправляем VKWebAppInit — это обязательный шаг
  vkBridge.send('VKWebAppInit');

  // Слушаем ответ
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
})();
