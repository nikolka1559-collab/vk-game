// game.js

const root = document.getElementById('root');

function updateStatus(text, isReady = false) {
  if (!root) return;
  root.innerHTML = `<p>${text}</p>`;
  if (isReady) {
    root.style.color = '#0077FF';
  } else {
    root.style.color = '#888';
  }
}

// 1. Проверяем, что vkBridge вообще есть (это мини‑апп ВКонтакте)
if (typeof vkBridge === 'undefined') {
  console.warn('⚠️ vkBridge не найден. Это не мини‑апп ВКонтакте или ошибка подключения скрипта.');
  updateStatus('❌ VK Bridge не найден. Проверьте подключение vk-bridge.min.js в index.html.');
  return;
}

// 2. Ждём готовности VK Bridge
updateStatus('⏳ Ожидание VK Bridge…');
vkBridge
  .load()
  .then((status) => {
    if (status === 'ok') {
      console.log('✅ VK Bridge загружен. Отправляем VKWebAppInit…');
      updateStatus('✅ VK Bridge готов. Отправка VKWebAppInit…', true);

      // 3. Отправляем обязательный инициализационный запрос
      vkBridge.send('VKWebAppInit');

      // 4. Слушаем ответ и показываем данные
      vkBridge.subscribe((e) => {
        if (e.detail.type === 'VKWebAppInitResult') {
          const data = e.detail.data;
          console.log('🚀 VKWebAppInitResult:', data);
          updateStatus(`✅ Приложение запущено!<br>vk_app_id: ${data.vk_app_id}<br>vk_user_id: ${data.vk_user_id}`, true);

          // --- ЗДЕСЬ НАЧИНАЕТСЯ ТВОЯ ЛОГИКА ИГРЫ ---
          // Например, можно запустить функцию startGame();
          // startGame();
          // -------------------------------------------
        }
      });
    } else {
      console.error('❌ VK Bridge не готов:', status);
      updateStatus(`❌ VK Bridge не готов: ${status}`, false);
    }
  })
  .catch((error) => {
    console.error('❌ Ошибка VK Bridge:', error);
    updateStatus('❌ Ошибка при загрузке VK Bridge. См. консоль.', false);
  });
