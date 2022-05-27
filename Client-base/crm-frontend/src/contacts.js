const bootstrap = require('bootstrap');
import IMask from 'imask';
import { el } from 'redom';
import phone from './assets/img/icons/phone.svg';
import email from './assets/img/icons/mail.svg';
import facebook from './assets/img/icons/fb.svg';
import vk from './assets/img/icons/vk.svg';
import other from './assets/img/icons/other.svg';
import { ValidationError } from './validation';

//Функция создания дом-элемента контакта
export function createNewContact() {
  const contactSelect = el(
    'li',
    { class: 'contact' },
    el('span', { class: 'text-danger contact-error' }),
    el('div', { class: 'input-group d-flex mb-2' }, [
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
        class: 'contact-inp flex-grow-1 rounded-0 form-control',
      }),
      el('button', {
        class: 'contact-cancel list-group-item border px-2 rounded-0',
      }),
    ])
  );
  return contactSelect;
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

export function renderContactIcons(contacts) {
  iconsWrapper = el('ul', { class: 'col-6 d-flex align-items-center' });
  contacts.forEach((elem) => {
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

//Функция создания массива контактов
export function getContacts() {
  const contactElements = Array.from(document.getElementsByClassName('contact'));
  const contacts = contactElements.map((e) => {
    const type = e.querySelector('.contact-select').value;
    const value = e.querySelector('.contact-inp').value;
    console.log(value.length);
    const inp = e.querySelector('.contact-inp');
    const label = e.querySelector('.contact-error');
    if (value.trim() === '') {
      throw new ValidationError('Заполните поле, пожалуйста', inp, label);
    }
    if (type === 'E-mail' && !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value.trim())) {
      throw new ValidationError('Введите корректный e-mail, пожалуйста', inp, label);
    }
    if (type === 'Телефон' && value.trim().length < 16) {
      throw new ValidationError('Укажите номер телефона полностью, пожалуйста', inp, label);
    }
    if (
      (type === 'Facebook' || type === 'Vk' || type === 'Другое') &&
      !/(http|https):\/\/([\w.]+\/?)\S*/.test(value.trim())
    ) {
      throw new ValidationError('Укажите ссылку, пожауйста', inp, label);
    }
    label.textContent = '';
    inp.classList.remove('is-invalid');
    return { type, value };
  });
  console.log(contacts);
  return contacts;
}

//Функция добавления контакта
export function addNewContact(contactList) {
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
    }
    if (this.value !== 'E-mail' && this.value !== 'Телефон') {
      mask.destroy();
    }
  });
  const cancelContacts = Array.from(document.getElementsByClassName('contact-cancel'));
  cancelContacts.forEach((e) =>
    e.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.remove();
    })
  );
  return newContactElement;
}
