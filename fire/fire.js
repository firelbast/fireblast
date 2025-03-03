(function() {
  'use strict';

  // Версія та назва моду
  var manifest = {
    type: 'video',
    version: '1.0.0',
    name: 'Fire Player',
    description: 'Плагін для відтворення відео з вогняним інтерфейсом'
  };

  // Змінні для зберігання даних
  var cards;
  var params = {};
  var component;

  // Основний об'єкт Fire
  var Fire = {
    // Ініціалізація
    init: function() {
      // Додаємо обробник подій для екрану фільму
      Lampa.Listener.follow('full', function(e) {
        if (e.type == 'complite') {
          Fire.addButton(e.data.movie);
        }
      });

      // Додаємо кнопку до активного екрану, якщо він вже відкритий
      if (Lampa.Activity.active() && Lampa.Activity.active().component == 'full') {
        if (!Lampa.Activity.active().activity.render().find('.view--fire_player').length) {
          Fire.addButton(Lampa.Activity.active().card);
        }
      }

      // Додаємо обробник подій для активності
      Lampa.Listener.follow('activity', function(e) {
        if (e.component == 'full' && e.type == 'start') {
          var button = Lampa.Activity.active().activity.render().find('.view--fire_player');
          if (button.length) {
            cards = e.object.card;
            Fire.startRcPlugin(button);
          }
        }
      });
    },

    // Додавання кнопки на екран фільму
    addButton: function(data) {
      cards = data;
      
      // Іконка вогню для кнопки
      var ico = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"></path></svg>';
      
      // HTML кнопки
      var button = "<div style='position:relative' data-subtitle='Fire Player v" + manifest.version + "' class='full-start__button selector view--fire_player'>" + ico + "<span>Fire Player</span></div>";
      
      // Створюємо кнопку
      var btn = $(Lampa.Lang.translate(button));
      
      // Додаємо обробник подій для кнопки
      btn.on('hover:enter', function() {
        Fire.startRcPlugin();
      });
      
      // Додаємо кнопку на екран
      var activity = Lampa.Activity.active().activity.render();
      var enabled = Lampa.Controller.enabled().name;
      
      var addButtonAndToggle = function(btn) {
        Lampa.Controller.toggle(enabled);
        Navigator.focus(btn[0]);
      };
      
      if ((enabled == 'full_start' || enabled == 'settings_component') && !activity.find('.view--fire_player').length) {
        // Додаємо кнопку після кнопки MODS's
        if (activity.find('.view--modss_online').length) {
          activity.find('.view--modss_online').after(btn);
          addButtonAndToggle(btn);
        }
        // Або після кнопки торрентів
        else if (activity.find('.view--torrent').length) {
          activity.find('.view--torrent').after(btn);
          addButtonAndToggle(btn);
        }
        // Або перед кнопкою відтворення
        else if (activity.find('.button--play').length) {
          activity.find('.button--play').before(btn);
          addButtonAndToggle(btn);
        }
      }
    },

    // Запуск плагіна rc
    startRcPlugin: function() {
      // Просто відкриваємо плеєр, не намагаючись завантажити rc.js
      Fire.openRcPlayer();
    },

    // Відкриття плеєра rc
    openRcPlayer: function() {
      // Отримуємо дані про фільм
      var card = Lampa.Activity.active().card;
      var id = Lampa.Utils.hash(card.number_of_seasons ? card.original_name : card.original_title);
      var all = Lampa.Storage.get('clarification_search', '{}');
      
      // Створюємо параметри для активності
      params = {
        url: '',
        title: 'RC Player',
        component: 'bwarch',
        search: all[id] ? all[id] : card.title,
        search_one: card.title,
        search_two: card.original_title,
        movie: card,
        page: 1,
        clarification: all[id] ? true : false
      };
      
      // Запускаємо активність
      Lampa.Activity.push(params);
    }
  };

  // Функція для запуску плагіна
  function startPlugin() {
    window.fire_plugin = true;
    Fire.init();
  }

  // Запускаємо плагін, якщо він ще не запущений
  if (!window.fire_plugin) startPlugin();

})();
