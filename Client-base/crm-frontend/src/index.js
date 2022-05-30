const bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import { Client, getClients, renderClient } from './client';
import { getContacts, addNewContact } from './contacts';
import { sortClients } from './sort';
import { searchClientDelay, clearSearchClient } from './search';

export const clientSurname = document.querySelector('#surname'),
  clientModal = document.querySelector('#client-modal'),
  clientName = document.querySelector('#name'),
  clientLastName = document.querySelector('#lastName'),
  clientForm = document.querySelector('#form'),
  contactList = document.querySelector('#contact-list'),
  bootstrapClientModal = new bootstrap.Modal(document.querySelector('#client-modal')),
  clientModalLabel = document.querySelector('#client-modal-label'),
  surnameLabel = document.querySelector('#surname-label'),
  nameLabel = document.querySelector('#name-label'),
  lastNameLabel = document.querySelector('#lastName-label');

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

clientModal.addEventListener('hide.bs.modal', () => {
  clientSurname.classList.remove('is-valid', 'is-invalid');
  clientName.classList.remove('is-valid', 'is-invalid');
  clientLastName.classList.remove('is-valid', 'is-invalid');
  clientSurname.value = '';
  clientName.value = '';
  clientLastName.value = '';
  surnameLabel.textContent = '';
  nameLabel.textContent = '';
  lastNameLabel.textContent = '';
  const contactElements = Array.from(contactList.children);
  contactElements.forEach((e) => e.remove());
});
