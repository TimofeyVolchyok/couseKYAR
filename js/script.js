
document.addEventListener('DOMContentLoaded', function () {
    // Функция для загрузки XML данных
    function loadXML(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseXML);
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                console.error('Ошибка загрузки XML: ' + url);
            }
        };
        xhr.send();
    }

     // Модальное окно
 const modal = document.getElementById('modal');
 const confirmPurchaseBtn = document.getElementById('confirm-purchase');
 let selectedRouteId = null;

 if (modal) {
    modal.style.display = 'none';


    const span = document.getElementsByClassName("close-button")[0];


    span.onclick = function () {
       modal.style.display = "none";
    }


    window.onclick = function (event) {
       if (event.target == modal) {
          modal.style.display = "none";
       }
    }

    if (confirmPurchaseBtn) {
       confirmPurchaseBtn.addEventListener('click', function () {
          if (selectedRouteId) {

             alert('Покупка билета на рейс ' + selectedRouteId + ' подтверждена!');


             modal.style.display = "none";
             selectedRouteId = null;
          }
       });
    }
 }

 // Функция для отображения расписания
 function displayTimetable(xml) {
    var departures = xml.getElementsByTagName('departure');
    var timetableTableBody = document.querySelector('#timetable-table tbody');

    if (!timetableTableBody) {
       console.error("Элемент с id 'timetable-table tbody' не найден.");
       return;
    }

    timetableTableBody.innerHTML = ''; // Очищаем таблицу

    for (var i = 0; i < departures.length; i++) {
       var departure = departures[i];

       var routeIdElement = departure.getElementsByTagName('route_id')[0];
       var routeId = routeIdElement ? routeIdElement.textContent : 'N/A';

       var routeNumberElement = departure.getElementsByTagName('route_number')[0];
       var routeNumber = routeNumberElement ? routeNumberElement.textContent : 'N/A';

       var destinationElement = departure.getElementsByTagName('destination')[0];
       var destination = destinationElement ? destinationElement.textContent : 'Неизвестно';

       var departureTimeElement = departure.getElementsByTagName('departure_time')[0];
       var departureTime = departureTimeElement ? departureTimeElement.textContent : 'Не указано';

       var arrivalTimeElement = departure.getElementsByTagName('arrival_time')[0];
       var arrivalTime = arrivalTimeElement ? arrivalTimeElement.textContent : 'Не указано';

       var availableSeatsElement = departure.getElementsByTagName('available_seats')[0];
       var availableSeats = availableSeatsElement ? availableSeatsElement.textContent : '0';

       var priceElement = departure.getElementsByTagName('price')[0];
       var price = priceElement ? priceElement.textContent : 'Бесплатно';


       var row = timetableTableBody.insertRow();
       row.insertCell().textContent = routeNumber;
       row.insertCell().textContent = destination;
       row.insertCell().textContent = departureTime;
       row.insertCell().textContent = arrivalTime;
       row.insertCell().textContent = availableSeats;
       row.insertCell().textContent = price;

       // Добавляем кнопку "Купить"
       var buyCell = row.insertCell();
       var buyButton = document.createElement('button');
       buyButton.textContent = 'Купить';
       buyButton.classList.add('button', 'primary', 'buy-button');  // Добавляем классы для стилизации
       buyCell.appendChild(buyButton);

       
       (function(routeNumber) {
          buyButton.addEventListener('click', function (event) {
             event.preventDefault(); 
             selectedRouteId = routeNumber;
             if (modal) {
                modal.style.display = "flex";
             }
          });
       })(routeNumber); 
    }
 }

    // Функция для отображения маршрутов
    function displayRoutes(xml) {
        var departures = xml.getElementsByTagName('departure');
        var routeList = document.querySelector('#routes .route-list');
    
        if (!routeList) {
            console.error("Элемент с class 'route-list' не найден.");
            return;
        }
    
        routeList.innerHTML = ''; // Очищаем список
    
        for (var i = 0; i < departures.length; i++) {
            var departure = departures[i];
            var routeNumber = departure.getElementsByTagName('route_number')[0].textContent;
            var destination = departure.getElementsByTagName('destination')[0].textContent;
            var departureTime = departure.getElementsByTagName('departure_time')[0].textContent;
            var arrivalTime = departure.getElementsByTagName('arrival_time')[0].textContent;
            var availableSeats = departure.getElementsByTagName('available_seats')[0].textContent;
            var price = departure.getElementsByTagName('price')[0].textContent;
            var busImage = departure.getElementsByTagName('bus_image')[0].textContent;
            var description = departure.getElementsByTagName('description')?.[0]?.textContent || ""; // Обработка отсутствия элемента
            var distance = departure.getElementsByTagName('distance')?.[0]?.textContent || ""; // Обработка отсутствия элемента
            var estimatedTime = departure.getElementsByTagName('estimated_time')?.[0]?.textContent || ""; // Обработка отсутствия элемента
    
    
            var routeItem = document.createElement('div');
            routeItem.classList.add('route-item');
    
            routeItem.innerHTML = `
                <h3>${destination} (№${routeNumber})</h3>
                <img src="${busImage}" alt="Маршрут ${destination}">
                <p>Время отправления: ${departureTime}, Время прибытия: ${arrivalTime}</p>
                <p>Мест: ${availableSeats}, Цена: ${price}</p>
                <p>${description}</p>  
                <p>Расстояние: ${distance}, Время в пути: ${estimatedTime}</p>
            `;
            routeList.appendChild(routeItem);
        }
    }
    
    

    // Функция для отображения новостей
    function displayNews(xml, targetElementId, maxItems = null) {
        var newsItems = xml.getElementsByTagName('news_item');
        var newsList = document.querySelector(`#${targetElementId} .news-list`);

        if (!newsList) {
            console.error(`Элемент с id '${targetElementId} .news-list' не найден.`);
            return;
        }

        newsList.innerHTML = ''; // Очищаем список

        let itemCount = 0;
        for (var i = 0; i < newsItems.length; i++) {
            if (maxItems && itemCount >= maxItems) {
                break;  // Stop after displaying the maximum number of items
            }

            var newsItem = newsItems[i];
            var title = newsItem.getElementsByTagName('title')[0].textContent;
            var date = newsItem.getElementsByTagName('date')[0].textContent;
            var description = newsItem.getElementsByTagName('description')[0].textContent;
            var image = newsItem.getElementsByTagName('image')[0].textContent;

            var newsElement = document.createElement('div');
            newsElement.classList.add('news-item');
            newsElement.innerHTML = `
                <img src="${image}" alt="${title}">
                <h3>${title}</h3>
                <p class="news-date">${date}</p>
                <p>${description}</p>
            `;

            newsList.appendChild(newsElement);
            itemCount++;
        }
    }

    // Загрузка и отображение данных в зависимости от страницы
    if (document.URL.includes("timetable.html")) {
        loadXML('../data/departures.xml', displayTimetable);
    }

    if (document.URL.includes("routes.html")) {
        loadXML('../data/routes.xml', displayRoutes);
    }

    if (document.URL.includes("news.html")) {
        loadXML('../data/news.xml', (xml) => displayNews(xml, 'news'));
    }

    if (document.URL.includes("index.html")) {
        loadXML('../data/news.xml', (xml) => displayNews(xml, 'news-preview', 3)); // Display only 3 news items on the homepage
    }

    // Обработка отправки формы обратной связи (пример)
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Предотвращаем отправку формы по умолчанию

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Здесь можно добавить код для отправки данных на сервер (например, с помощью fetch API)
            console.log('Имя:', name);
            console.log('Email:', email);
            console.log('Сообщение:', message);

            alert('Сообщение отправлено!'); // Простое уведомление
        });
    }

  
    const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
   });
});

