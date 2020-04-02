// const listUsers = document.querySelector('.users'),
// 		card = document.querySelector('.card-wrapper'),
// 		form = document.forms[1];

// function addListUsers(error, users) {
// 	if (error) {
// 		console.log(`Error`, users);
// 		return;
// 	}
// 	const fragment = document.createDocumentFragment();
// 	users.forEach( (user) => {
// 		const li = listItem(user);
// 		fragment.append(li);
// 	})

// 	listUsers.append(fragment);
// }

// function listItem(user) {
// 	const li = document.createElement('li'),
// 			h4 = document.createElement('h5');
			
// 		li.classList.add('list-user');
// 		li.setAttribute('id', user.id)
// 		h4.textContent = user.name;
// 		li.append(h4);
// 		return li;
// }

// function addCard(error, users, target) {
// 	if (error) {
// 		console.log(`Error`, users)
// 	}
// 	card.innerHTML = '';

// 	users.forEach( (user) => {
// 		if (target === user.name) {
// 			const divCard = createCardUser(user);
// 			card.append(divCard);
// 		}
// 	})
// }

// function formUserShow(error, users) {
// 	if (error) {
// 		console.log(`Error`, users)
// 	}
// 	card.innerHTML = '';

// 	const divCard = createCardUser(users);
// 	card.append(divCard);
// }

// function createCardUser(user) {
// 	const div = document.createElement('div'),
// 		divCardBody = document.createElement('div'),
// 		h4 = document.createElement('h4'),
// 		article = document.createElement('p'),
// 		fragment = document.createDocumentFragment();
// 	div.classList.add('card');
// 	divCardBody.classList.add('card-body');
// 	h4.classList.add('card-title');
// 	article.classList.add('card-text');
// 	h4.textContent = `Username ${user.name}`;
// 	article.textContent = `Email: ${user.email}\r\nPhone: ${user.phone}`;
// 	divCardBody.append(h4);
// 	divCardBody.append(article);
// 	div.append(divCardBody);
// 	fragment.append(div);
// 	return fragment;
// }

// function http() {
// 	return {
// 		get(url, cb, target) {
// 			try {
// 				const xhr = new XMLHttpRequest();
// 				xhr.open('GET', url);
// 				xhr.send();

// 				xhr.addEventListener('error', () => {
// 					console.log(`Error!`)
// 				})

// 				xhr.addEventListener('load', () => {
// 					if (Math.floor(xhr.status / 100) !== 2) {
// 						console.log(`Error. Status code: ${xhr.status}`, xhr);
// 						return;
// 					}

// 					const response = JSON.parse(xhr.response);

// 					if (target) {
// 						const targetName = target.textContent;
// 						cb(null, response, targetName);	
// 					} else
// 					cb(null, response);
// 				})
// 			} catch(error) {
// 				console.log(`Error`, error)
// 			}
			
// 		},
// 		post(url, body, headers, cb) {
// 			try {
// 				const xhr = new XMLHttpRequest();
// 				xhr.open('POST', url);

// 				xhr.addEventListener('error', () => {
// 						console.log(`Error!`)
// 				})

// 				xhr.addEventListener('load', () => {
// 					if (Math.floor(xhr.status / 100) !== 2) {
// 						console.log(`Error. Status code: ${xhr.status}`, xhr);
// 						return;
// 					}

// 					const response = JSON.parse(xhr.response);
// 					cb(null, response);
// 				})

// 				if (headers) {
// 					Object.entries(headers).forEach( ([key, value]) => {
// 						xhr.setRequestHeader(key, value);
// 					});
// 				}
// 				xhr.send(JSON.stringify(body));
// 			} catch(error) {
// 				console.log(`Error`, error)
// 			}
// 		}
// 	};
// }

// const myHttp = http();
// myHttp.get('https://jsonplaceholder.typicode.com/users', addListUsers, null);

// listUsers.addEventListener('click', ({target}) => {
// 	myHttp.get('https://jsonplaceholder.typicode.com/users', addCard, target);
// })

// form.addEventListener('submit', (evt) => {
// 	evt.preventDefault();
// 	const name = {
// 		name: evt.target['0'].value,
// 		email: evt.target['1'].value,
// 		username: evt.target['2'].value,
// 		phone: evt.target['3'].value,
// 		website: evt.target['4'].value
// 	}
// 	myHttp.post('https://jsonplaceholder.typicode.com/posts', name, {
// 		'content-type': 'application/json'
// 	}, formUserShow)
// })




















