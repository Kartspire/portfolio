const bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import { Client, getClients, renderClient } from './client';
import { getContacts, addNewContact } from './contacts';
import { sortClients } from './sort';
import { searchClientDelay, clearSearchClient } from './search';

export const clientSurname = document.querySelector('#surname'),
  clientName = document.querySelector('#name'),
  clientLastName = document.querySelector('#lastName'),
  clientForm = document.querySelector('#form'),
  contactList = document.querySelector('#contact-list'),
  bootstrapClientModal = new bootstrap.Modal(document.querySelector('#client-modal')),
  clientModalLabel = document.querySelector('#client-modal-label');

const addContactButton = document.querySelector('#add-contact-btn'),
  clientsList = document.querySelector('#clients-list'),
  createClientButton = document.querySelector('#create-client'),
  sortButton = document.querySelector('#sort-button'),
  clientsSearchInput = document.querySelector('#clients-search');

//Глобальные переменные для удаления и обновления данных клиента.-
let clientsElems;

//Загрузка клиентов при открытии
window.addEventListener('load', () => {
  document.getElementById('wrapper').style.display = 'block';
});
getClients().then((res) => {
  res.forEach((e) => {
    const client = new Client(e.name, e.surname, e.lastName, e.contacts, e.id, e.createdAt, e.updatedAt);
    clientsList.append(renderClient(client).clientElement);
  });
  document.getElementById('load-screen').classList.add('d-none');
});

export const createNewClient = function (evt) {
  evt.preventDefault();
  try {
    const client = new Client(clientName.value, clientSurname.value, clientLastName.value, getContacts());
    client.postClient().then((res) => {
      client.id = res.id;
      client.createdAt = res.createdAt;
      client.updatedAt = res.updatedAt;
      console.log(client);
      clientsList.append(renderClient(client).clientElement);
      console.log(res);
      bootstrapClientModal.hide();
    });
  } catch (error) {
    console.log(error);
    error.showErrorMessage();
  }
};

//Отправка формы добавления клиента и отрисовка
createClientButton.addEventListener('click', () => {
  clientModalLabel.textContent = 'Добавить клиента';
  clientForm.addEventListener('submit', createNewClient);
});

//Добавление контакта
addContactButton.addEventListener('click', () => {
  addNewContact(contactList);
});

// patchContactButton.addEventListener('click', () => {
//   addNewContact(patchContactList);
// });

// Сортировка
let switcher = true;
sortButton.addEventListener('click', (e) => {
  e.preventDefault();
  const target = e.target;
  switcher = !switcher;
  const sortId = target.dataset.sortNumber;
  clientsElems = Array.from(document.getElementsByClassName('client'));
  sortClients(clientsElems, clientsList, switcher, sortId);
});

// Поиск клиента
clientsSearchInput.addEventListener('input', (e) => {
  clientsElems = Array.from(document.getElementsByClassName('client'));
  clearSearchClient();
  searchClientDelay(e, clientsElems);
});

//Валидация
// addSurname.addEventListener('input', function () {
//   clearValidation();
//   validationDelay(this.value, 'фамилия', this, addSurnameLabel, addClientButton);
//   // validation(this.value, 'фамилия', this, addSurnameLabel, addClientButton);
// });
// patchSurname.addEventListener('input', function () {
//   clearValidation();
//   validationDelay(this.value, 'фамилия', this, patchSurnameLabel, patchClientButton);
//   // validation(this.value, 'фамилия', this, patchSurnameLabel, patchClientButton);
// });

//Удаление клиента
// function removeClient() {
//   deleteClient(clientId);
//   clientElement.remove();
// }

// deleteClientModal.addEventListener('show.bs.modal', (e) => {
//   clientId = e.relatedTarget.parentElement.dataset.clientId;
//   clientElement = e.relatedTarget.parentElement.parentElement;
//   deleteClientButton.addEventListener('click', () => {
//     removeClient();
//     clientId = '';
//   });
//   deleteClientModal.addEventListener('keydown', function (e) {
//     if (e.keyCode === 13) {
//       removeClient();
//       clientId = '';
//       bootstrapDeleteClientModal.hide();
//     }
//   });
// });

//Изменить данные клиента
// patchClientModal.addEventListener('show.bs.modal', (e) => {
//   clientId = e.relatedTarget.parentElement.dataset.clientId;
//   clientElement = e.relatedTarget.parentElement.parentElement;

//   getClient(clientId).then((res) => {
//     patchSurname.value = res.surname;
//     patchName.value = res.name;
//     patchLastname.value = res.lastName;
//     res.contacts.forEach((e) => {
//       const newContact = addNewContact(patchContactList);
//       newContact.querySelector('input').value = e.value;
//       Array.from(newContact.querySelector('select').querySelectorAll('option')).forEach((elem) => {
//         if (elem.value === e.type) {
//           elem.selected = true;
//           return;
//         }
//       });
//     });
//   });
// });

// patchClientForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   try {
//     const client = new Client(patchSurname.value, patchName.value, patchLastname.value, getContacts());
//     client.patchClient(clientId).then((res) => {
//       clientElement.remove();
//       clientsList.append(renderClient(res));
//       bootstrapPatchClientModal.hide();
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
