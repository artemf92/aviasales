// Переменные 

const inputCitiesFrom = document.querySelector('.input__cities-from'),
	dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
	dropdown = document.querySelectorAll('.dropdown'),
	inputCitiesTo = document.querySelector('.input__cities-to'),
	inputDateDepart = document.querySelector('.input__date-depart'),
	dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
	cheapestTicket = document.getElementById('cheapest-ticket'),
	otherCheapTickets = document.getElementById('other-cheap-tickets'),
	form = document.forms[0];

let cities = [];

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const calendarUrl = 'http://min-prices.aviasales.ru/calendar_preload';
const apiKey = '88562cab880efd390d21ba16dcaf0c12';

const http = customHttp();

// Функции выбора городов

function customHttp() {
	return {
		get(url, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.addEventListener('load', () => {
					if (xhr.status === 400) {
						alert('Туда не летают самолеты!');
						form.reset();
					}
					if (Math.floor(xhr.status / 100) !== 2) {
						console.error(`Error `, xhr.status);
						return;
					}

					const response = JSON.parse(xhr.response);
					cb(response);

				})

				xhr.addEventListener('error', () => {
					console.error(`Error. Status code: ${xhr.status}`)
					return;
				})

				xhr.send();
			} catch(error) {
				console.log(`Error HTML: `, error);
			}
		},
		post(url, body, headers, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', url);
				xhr.addEventListener('load', () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						console.error(`Error `, xhr.status);
						return;
					}

					const response = JSON.parse(xhr.response);
					cb(response);

				})

				xhr.addEventListener('error', () => {
					console.error(`Error. Status code: ${xhr.status}`)
					return;
				})

				if(headers) {
					Object.entries(headers).forEach( ({key, value}) => {
						xhr.setRequestHeader(key, value);
					})
				}

				xhr.send(JSON.stringify(body));
			} catch(error) {
				console.log(`Error HTML: `, error);
			}
		}
	}
}

// Отображение списка городов под полем ввода
function showCity(input, list) {
	let text = input.value;
	list.textContent = '';

	if (text !== '') { 
		const filterCity = cities.filter( (item) => {
			const name = item.name;
			return name.toLowerCase().startsWith(text.toLowerCase());
		})

		filterCity.sort( (a,b) => { 
		  if (a.name > b.name) { 
		    return 1; } 
		  if (a.name < b.name) { 
		    return -1; } 
		  return 0; 
		});

		filterCity.forEach( item => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item.name;
			list.append(li);
		})
	}
}

const selectCity = (evt, input, list) => {
	const target = evt.target;

	if (target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent;
		list.textContent = '';
	}
}

// Получение массивов билетов на указанный день и на весь месяц
function renderCheap(response, date) {
	const cheapTicketsMonth = response.best_prices;
		if (cheapTicketsMonth.length) {
		cheapTicketsMonth.sort( (a, b) => a.value - b.value);
		const cheapTicketDay = cheapTicketsMonth.filter( item => item.depart_date === date);

		if(cheapTicketDay[0]) {
			const ticket = createCard(cheapTicketDay[0], true);
			cheapestTicket.insertAdjacentElement('beforeend', ticket);
		} else {
			ticket = createCard(null, false);
			cheapestTicket.insertAdjacentElement('beforeend', ticket);
		}

		for (let i = 0; i <= 4; i++) {
			const ticketsMonth = createCard(cheapTicketsMonth[i], true);
			otherCheapTickets.insertAdjacentElement('beforeend', ticketsMonth);
		}
	} else {
		const empty = createCard({}, false);
		cheapestTicket.insertAdjacentElement('beforeend', empty);
	}
}

// GET запрос на все билеты для указанных городов
function getCalendarPrice({ from, to, date}) {

 	http.get(
 		`${proxy}${calendarUrl}?origin=${from}&destination=${to}&depart_date=${date}&one_way=true`,
 		(response) => {
 			renderCheap(response, date);
 		})
}

// Создание разметки билета
function createCard({ value, origin, number_of_changes, gate, destination, depart_date }, bool) {
	let article = document.createElement('article');
	article.classList.add('ticket');
	let template = '';
	if (bool) {
		template = `
		<h3 class="agent">${gate}</h3>
		<div class="ticket__wrapper">
			<div class="left-side">
				<a href=${getLinkAviasales(origin, destination, depart_date)} class="button button__buy" target='_blank'>Купить
					за ${value}₽</a>
			</div>
			<div class="right-side">
				<div class="block-left">
					<div class="city__from">Вылет из города
						<span class="city__name">${getCityName(origin)}</span>
					</div>
					<div class="date">${getDate(depart_date)}</div>
				</div>
	
				<div class="block-right">
					<div class="changes">${getChanges(number_of_changes)}</div>
					<div class="city__to">Город назначения:
						<span class="city__name">${getCityName(destination)}</span>
					</div>
				</div>
			</div>
		</div>
		`;
	} else {
		template = '<h3>К сожалению, билетов на этот день не нашлось</h3>'
	}
	article.insertAdjacentHTML('afterbegin', template);

	return article;
	// cheapestTicket.insertAdjacentHTML('beforeend', article);
}

// Очистка списка билетов
function clearTicketsList(elementOne, elementTwo) {
	elementOne.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
	elementTwo.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
	elementOne.style.display = 'block';
	elementTwo.style.display = 'block';
}

// Получение название города
function getCityName(code) {
	return cities.find(ticket => ticket.code === code).name;
}

// Получение количества пересадок
function getChanges(num) {
	if (num > 1) 
		return `С двумя пересадками`;
	else if(num === 1)
		return `С одной пересадкой`;
	else 
		return `Без пересадок`;
}

// Получение корректной даты
function getDate(num) {
	return new Date(num).toLocaleString('ru', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
// Очистка списка городов
function clearCitiesList() {
	if(dropdownCitiesFrom.childElementCount || dropdownCitiesTo.childElementCount) {
		dropdownCitiesFrom.innerText = '';
		dropdownCitiesTo.innerText = '';
	}
}

// Создание ссылки на покупку билета
function getLinkAviasales(from, to, date) {
	let day = new Date(date).toLocaleString('ru', {
		day: 'numeric',
		month: 'numeric'
	})
	return `https://www.aviasales.ru/search/${from}${day.split('.').join('')}${to}1`;
	// https://www.aviasales.ru/search/SVX2905KGD1
}

// Обработчики событий

inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (evt) => {
	selectCity(evt, inputCitiesFrom, dropdownCitiesFrom)
})

dropdownCitiesTo.addEventListener('click', (evt) => {
	selectCity(evt, inputCitiesTo, dropdownCitiesTo)
})


http.get(proxy + citiesApi, (data) => {
	cities = data.filter( (item) => item.name);
})

form.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const cityFrom = cities.find( item => item.name === inputCitiesFrom.value);
	const cityTo = cities.find( item => item.name === inputCitiesTo.value);

	if(!cityFrom || !cityTo) {
		alert('Введите корректное название города');
		return;
	}

	clearCitiesList();

	clearTicketsList(cheapestTicket, otherCheapTickets);

	const formData = {
		from: cityFrom.code,
		to: cityTo.code,
		date: inputDateDepart.value
	}

 	getCalendarPrice(formData);
})

document.body.addEventListener('click', () => {
	clearCitiesList();
})





