const bootstrap = require('bootstrap');
import IMask from 'imask';
import { el } from 'redom';
import phone from './assets/img/icons/phone.svg';
import email from './assets/img/icons/mail.svg';
import facebook from './assets/img/icons/fb.svg';
import vk from './assets/img/icons/vk.svg';
import other from './assets/img/icons/other.svg';

//Функция создания дом-элемента контакта
export function createNewContact() {
  const contactSelect = el(
    'li',
    { class: 'contact input-group d-flex mb-2' },
    el(
      'select',
      {
        class: 'contact-select list-group-item rounded-0 ',
      },
      [
        el('option', 'Телефон'),
        el('option', 'E-mail'),
        el('option', 'Facebook'),
        el('option', 'VK'),
        el('option', 'Другое'),
      ]
    ),
    el('input', {
      required: 'true',
      class: 'contact-inp list-group-item flex-grow-1 rounded-0 ',
    }),
    el('a', {
      class: 'contact-cancel list-group-item border px-2 rounded-0',
    })
  );
  return contactSelect;
}

//Создание объекта контакта
export class Contact {
  constructor(contactType, contactValue) {
    this.type = contactType;
    this.value = contactValue;
  }

  set contactType(value) {
    this._type = value;
  }
  get contactType() {
    return this._type;
  }

  set contactValue(value) {
    this._value = value;
  }
  get contactValue() {
    return this._value;
  }
}

//Иконки контактов
let iconsWrapper;
function appendContactIcon(type, elem) {
  const contactIconElem = el(
    'li',
    {
      class: 'icons-gutter',
    },
    el('img', {
      'data-toggle': 'tooltip',
      'data-placement': 'bottom',
      'title': `${elem.type}: ${elem.value}`,
      src: type,
    })
  );
  iconsWrapper.append(contactIconElem);
  //Инициализация тултипов для иконок контактов
  new bootstrap.Tooltip(contactIconElem.firstChild);
}

export function renderContactIcons(client) {
  iconsWrapper = el('ul', { class: 'col-2 d-flex align-items-center' });
  client.contacts.forEach((elem) => {
    if (elem.type === 'Телефон') {
      appendContactIcon(phone, elem);
    } else if (elem.type === 'E-mail') {
      appendContactIcon(email, elem);
    } else if (elem.type === 'Facebook') {
      appendContactIcon(facebook, elem);
    } else if (elem.type === 'VK') {
      appendContactIcon(vk, elem);
    } else if (elem.type === 'Другое') {
      appendContactIcon(other, elem);
    }
  });
  return iconsWrapper;
}
