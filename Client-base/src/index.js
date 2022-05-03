const bootstrap = require('bootstrap');
import IMask from 'imask';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import { Client, getClients, getClient, postClient, patchClient, deleteClient, renderClient } from './client';
import { createNewContact, Contact } from './contacts';
import { sortClients } from './sort';
import { searchClientDelay, clearSearchClient } from './search';

const addSurname = document.getElementById('add-surname');
const addName = document.getElementById('add-name');
const addLastname = document.getElementById('add-lastname');
const addForm = document.getElementById('add-form');
const addContactList = document.getElementById('add-contact-list');
const addContactButton = document.getElementById('add-contact-btn');
const addClientModal = document.getElementById('add-client-modal');
const bootstrapAddClientModal = new bootstrap.Modal(document.getElementById('add-client-modal'));
const clientsList = document.getElementById('clients-list');
const deleteClientButton = document.getElementById('delete-client-button');
const deleteClientModal = document.getElementById('delete-client-modal');
const bootstrapDeleteClientModal = new bootstrap.Modal(document.getElementById('delete-client-modal'));
const patchClientForm = document.getElementById('patch-form');
const patchClientButton = document.getElementById('patch-client-button');
const patchClientModal = document.getElementById('patch-client-modal');
const bootstrapPatchClientModal = new bootstrap.Modal(document.getElementById('patch-client-modal'));
const patchSurname = document.getElementById('patch-surname');
const patchName = document.getElementById('patch-name');
const patchLastname = document.getElementById('patch-lastname');
const patchContactList = document.getElementById('patch-contact-list');
const patchContactButton = document.getElementById('patch-contact-btn');
const sortButton = document.getElementById('sort-button');
const clientsSearchInput = document.getElementById('clients-search');
//Глобальные перемен ные для удаления и обновления данных клиента.-
let clientId;
let clientElement;
let clientsElems;
//Загрузка клиентов при открытии
window.addEventListener('load', () => {
  document.getElementById('wrapper').style.display = 'block';
});
getClients().then((res) => {
  res.forEach((e) => clientsList.append(renderClient(e)));
  document.getElementById('load-screen').classList.add('d-none');
});

//Функция создания массива контактов
function getContacts() {
  const contactElements = Array.from(document.getElementsByClassName('contact'));
  const contacts = [];
  contactElements.forEach((e) => {
    const contactType = e.querySelector('.contact-select').value;
    const contactValue = e.querySelector('.contact-inp').value;
    const contact = new Contact(contactType, contactValue);
    contacts.push(contact);
    console.log(contacts);
  });
  return contacts;
}

//Отправка формы добавления клиента и отрисовка
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const client = new Client(addSurname.value, addName.value, addLastname.value, getContacts());
    postClient(client).then((res) => {
      clientsList.append(renderClient(res));
      bootstrapAddClientModal.hide();
    });
  } catch (error) {
    console.log(error);
  }
});

//Функция добавления контакта
function addNewContact(contactList) {
  const newContactElement = createNewContact();
  const contactSelectElement = newContactElement.querySelector('select');
  const contactInputElement = newContactElement.querySelector('input');
  let mask = IMask(contactInputElement, {
    mask: '+{7}(000)000-00-00',
  });
  contactList.append(newContactElement);
  contactSelectElement.addEventListener('change', function () {
    contactInputElement.value = '';
    if (this.value === 'Телефон') {
      contactInputElement.type = 'tel';
      mask = IMask(contactInputElement, {
        mask: '+{7}(000)000-00-00',
      });
    }
    if (this.value === 'E-mail') {
      mask.destroy();
      contactInputElement.type = 'email';
    }
    if (this.value !== 'E-mail' && this.value !== 'Телефон') {
      mask.destroy();
      contactInputElement.type = 'url';
    }
  });
  const cancelContacts = Array.from(document.getElementsByClassName('contact-cancel'));
  cancelContacts.forEach((e) =>
    e.addEventListener('click', (e) => {
      e.target.parentElement.remove();
    })
  );
  return newContactElement;
}

//Добавление контакта
addContactButton.addEventListener('click', () => {
  addNewContact(addContactList);
});

//Функция очистки формы при закрытии окна
function clearForm(surname, name, lastname, contactList) {
  surname.value = '';
  name.value = '';
  lastname.value = '';
  const contactElements = Array.from(contactList.children);
  contactElements.forEach((e) => e.remove());
}

//Очистить фомру добавления при закрытии модального окна
addClientModal.addEventListener('hidden.bs.modal', () => {
  clearForm(addSurname, addName, addLastname, addContactList);
});

//Удаление клиента
function removeClient() {
  deleteClient(clientId);
  clientElement.remove();
}

deleteClientModal.addEventListener('show.bs.modal', (e) => {
  clientId = e.relatedTarget.parentElement.dataset.clientId;
  clientElement = e.relatedTarget.parentElement.parentElement;
  deleteClientButton.addEventListener('click', () => {
    removeClient();
    clientId = '';
  });
  deleteClientModal.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      removeClient();
      clientId = '';
      bootstrapDeleteClientModal.hide();
    }
  });
});

//Изменить данные клиента
patchClientModal.addEventListener('show.bs.modal', (e) => {
  clientId = e.relatedTarget.parentElement.dataset.clientId;
  clientElement = e.relatedTarget.parentElement.parentElement;
  console.log(clientId);

  getClient(clientId).then((res) => {
    console.log(res);
    patchSurname.value = res.surname;
    patchName.value = res.name;
    patchLastname.value = res.lastName;
    res.contacts.forEach((e) => {
      const newContact = addNewContact(patchContactList);
      newContact.querySelector('input').value = e.value;
      Array.from(newContact.querySelector('select').querySelectorAll('option')).forEach((elem) => {
        if (elem.value === e.type) {
          elem.selected = true;
          return;
        }
      });
    });
  });
});

patchClientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const client = new Client(patchSurname.value, patchName.value, patchLastname.value, getContacts());
    patchClient(client, clientId).then((res) => {
      clientElement.remove();
      clientsList.append(renderClient(res));
      bootstrapPatchClientModal.hide();
    });
  } catch (error) {
    console.log(error);
  }
});

patchContactButton.addEventListener('click', () => {
  addNewContact(patchContactList);
});

// Очистить форму изменения при закрытии модального окна
patchClientModal.addEventListener('hidden.bs.modal', () => {
  clearForm(patchSurname, patchName, patchLastname, patchContactList);
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
