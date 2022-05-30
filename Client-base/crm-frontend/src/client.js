import { el } from 'redom';
import { getContacts, addNewContact, renderContactIcons } from './contacts';
import { ValidationError } from './validation';
import {
  clientName,
  clientSurname,
  clientLastName,
  contactList,
  clientForm,
  bootstrapClientModal,
  createNewClient,
  clientModalLabel,
  clientModal,
  surnameLabel,
  nameLabel,
  lastNameLabel,
} from './index';

const deleteClientModalButton = document.querySelector('#delete-client-modal-button');

//Создание объекта клиента
export class Client {
  constructor(name, surname, lastName, contacts, id, createdAt, updatedAt) {
    this.surname = surname;
    this.name = name;
    this.lastName = lastName;
    this.contacts = contacts;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    // this.inputName = inputName;
  }

  validation(value, field, inp, label) {
    if (value.trim().length < 2) {
      throw new ValidationError(`${field} не может содержать меньше двух символов`, inp, label);
    }
    if (/\d+/g.test(value)) {
      throw new ValidationError(`${field} не может содержать цифры`, inp, label);
    }
    label.textContent = '';
    inp.classList.remove('is-invalid');
    return value;
  }

  // Сеттер-геттер на имя
  set surname(value) {
    this._surname = this.validation(value, 'Фамилия', clientSurname, surnameLabel);
  }
  get surname() {
    return this._surname;
  }

  // Сеттер-геттер на фамилию
  set name(value) {
    this._name = this.validation(value, 'Имя', clientName, nameLabel);
  }
  get name() {
    return this._name;
  }

  // Сеттер-геттер на отчество
  set lastName(value) {
    this._lastName = this.validation(value, 'Отчество', clientLastName, lastNameLabel);
  }
  get lastName() {
    return this._lastName;
  }
  // Сеттер-геттер на контакты
  set contacts(value) {
    this._contacts = value;
  }
  get contacts() {
    return this._contacts;
  }
  // //Сеттер-геттер на ID
  set id(value) {
    this._id = value;
  }
  get id() {
    return this._id;
  }

  //Сеттер и гетер на время обновления
  set updatedAt(value) {
    this._updatedAt = reformTime(value);
  }
  get updatedAt() {
    return this._updatedAt;
  }
  //Сеттер и геттер на время создания
  set createdAt(value) {
    this._createdAt = reformTime(value);
  }
  get createdAt() {
    return this._createdAt;
  }

  //Изменить данные клиента
  async patchClient() {
    const responce = await fetch(`http://localhost:3000/api/clients/${this.id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        name: this.name,
        surname: this.surname,
        lastName: this.lastName,
        contacts: this.contacts,
      }),
    });
    return await responce.json();
  }

  //Данные одного клиента с сервера
  async getClient() {
    const responce = await fetch(`http://localhost:3000/api/clients/${this.id}`);
    return await responce.json();
  }

  //Отправка клиента на сервер
  async postClient() {
    const responce = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.name,
        surname: this.surname,
        lastName: this.lastName,
        contacts: this.contacts,
      }),
    });
    return await responce.json();
  }

  //Удалить клиента
  async deleteClient() {
    await fetch(`http://localhost:3000/api/clients/${this.id}`, {
      method: 'DELETE',
    });
  }
}

//Функия отрисовки клиента
export function renderClient(client) {
  const clientElement = el('li', {
    class: 'client list-group-item row d-flex px-0 justify-content-between',
  });
  const clientElementInfoWrapper = el('div', { class: 'col-8 d-flex' });
  const clientElementId = el('div', { class: 'col-2', id: 'client-id' }, client.id);
  const clientElementFio = el(
    'div',
    { class: 'col-4 px-4 fio' },
    `${client.surname} ${client.name} ${client.lastName}`
  );
  const clientElementCreatedAt = el(
    'div',
    { class: 'col-3 px-4' },
    `${client.createdAt.reformedDate} ${client.createdAt.reformedTime}`
  );
  const clientElementUpdatedAt = el(
    'div',
    { class: 'col-3 px-4' },
    `${client.updatedAt.reformedDate} ${client.updatedAt.reformedTime}`
  );
  const clientElementRigthBarWrapper = el('div', {
    class: 'col-4 d-flex justify-content-between',
  });
  const clientElementBtnWrapper = el('div', { class: 'col-6' });
  let clientElementContacts = renderContactIcons(client.contacts);
  const clientElementPatchButton = el(
    'button',
    {
      class: 'col-6 px-2 btn border-0 patchClient',
      'data-bs-toggle': 'modal',
      'data-bs-target': '#client-modal',
    },
    'изменить'
  );
  const clientElementDeleteButton = el(
    'button',
    {
      class: 'col-6 px-2 btn border-0 deleteClient',
      'data-bs-toggle': 'modal',
      'data-bs-target': '#delete-client-modal',
    },
    'удалить'
  );
  clientElementInfoWrapper.append(clientElementId, clientElementFio, clientElementCreatedAt, clientElementUpdatedAt);
  clientElementBtnWrapper.append(clientElementPatchButton, clientElementDeleteButton);
  clientElementRigthBarWrapper.append(clientElementContacts, clientElementBtnWrapper);
  clientElement.append(clientElementInfoWrapper, clientElementRigthBarWrapper);

  // Удалить клиента
  clientElement.querySelector('.deleteClient').addEventListener('click', (e) => {
    deleteClientModalButton.addEventListener(
      'click',
      () => {
        client.deleteClient();
        clientElement.remove();
      },
      { once: true }
    );
  });

  //Изменить данные клиента
  const renewClient = function (evt) {
    evt.preventDefault();
    try {
      client.surname = clientSurname.value;
      client.name = clientName.value;
      client.lastName = clientLastName.value;
      client.contacts = getContacts();
      client.patchClient().then((res) => {
        bootstrapClientModal.hide();
        clientElementFio.textContent = `${res.surname} ${res.name} ${res.lastName}`;
        clientElementUpdatedAt.textContent = `${reformTime(res.updatedAt).reformedDate} ${
          reformTime(res.updatedAt).reformedTime
        }`;
        clientElementContacts.remove();
        clientElementContacts = renderContactIcons(res.contacts);
        clientElementRigthBarWrapper.prepend(clientElementContacts);
      });
    } catch (error) {
      error.showErrorMessage();
    }
  };

  //Изменить клиента
  clientElement.querySelector('.patchClient').addEventListener('click', () => {
    clientSurname.value = client.surname;
    clientName.value = client.name;
    clientLastName.value = client.lastName;
    clientModalLabel.textContent = 'Изменить данные';
    client.contacts.forEach((e) => {
      const newContact = addNewContact(contactList);
      newContact.querySelector('input').value = e.value;
      Array.from(newContact.querySelector('select').querySelectorAll('option')).forEach((elem) => {
        if (elem.value === e.type) {
          elem.selected = true;
          return;
        }
      });
    });
    clientForm.addEventListener('submit', renewClient);
  });

  //Очистить фомру закрытии модального окна
  clientModal.addEventListener('hide.bs.modal', () => {
    clientForm.removeEventListener('submit', createNewClient);
    clientForm.removeEventListener('submit', renewClient);
  });

  return {
    clientElement,
    clientElementId,
    clientElementFio,
    clientElementCreatedAt,
    clientElementUpdatedAt,
    clientElementContacts,
  };
}

//Функция правильного формата времени
function reformTime(dateFromServer) {
  const date = new Date(dateFromServer);
  const format = (date) => (date < 10 ? `0${date}` : date.toString());

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const min = date.getMinutes();

  const reformedDate = `${format(day)}:${format(month)}:${year}`;
  const reformedTime = `${format(hours)}:${format(min)}`;
  return { reformedDate, reformedTime };
}

//Данные клиентов с сервера
export async function getClients() {
  const responce = await fetch('http://localhost:3000/api/clients');
  return await responce.json();
}

// Очистить форму изменения при закрытии модального окна
// patchClientModal.addEventListener('hidden.bs.modal', () => {
//   clearForm(patchSurname, patchName, patchLastName, patchContactList);
// });
