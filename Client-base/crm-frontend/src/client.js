import { el } from "redom";
import { renderContactIcons } from "./contacts";

//Создание объекта клиента
export class Client {
  constructor(surname, name, lastname, contacts) {
    this.surname = surname;
    this.name = name;
    this.lastname = lastname;
    this.contacts = contacts;
  }
  // Сеттер-геттер на фамилию
  set surname(value) {
    if (value.trim().length < 2) {
      throw new Error("Слишком короткая фамилия");
    } else {
      this._surname = value;
    }
  }
  get surname() {
    return this._surname;
  }
  // Сеттер-геттер на имя
  set name(value) {
    if (value.trim().length < 2) {
      throw new Error("Слишком короткое имя");
    } else {
      this._name = value;
    }
  }
  get name() {
    return this._name;
  }
  // Сеттер-геттер на отчество
  set lastname(value) {
    if (value.trim().length < 2) {
      throw new Error("Слишком коротке отчество");
    } else {
      this._lastname = value;
    }
  }
  get lastname() {
    return this._lastname;
  }
  // Сеттер-геттер на контакты
  set contacts(value) {
    this._contacts = value;
  }
  get contacts() {
    return this._contacts;
  }

  //Отправка клиента на сервер
  async postClient() {
    const responce = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.name,
        surname: this.surname,
        lastName: this.lastname,
        contacts: this.contacts,
      }),
    });
    return await responce.json();
  }

  //Изменить данные клиента
 async  patchClient(clientId) {
  const responce = await fetch(
    `http://localhost:3000/api/clients/${clientId}`,
    {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: this.name,
        surname: this.surname,
        lastName: this.lastname,
        contacts: this.contacts,
      }),
    }
  );
  return await responce.json();
}

  
}

//Данные клиентов с сервера
export async function getClients() {
  const responce = await fetch("http://localhost:3000/api/clients");
  return await responce.json();
}

 //Данные одного клиента с сервера
 export async function getClient(clientId) {
  const responce = await fetch(
    `http://localhost:3000/api/clients/${clientId}`
  );
  return await responce.json();
}

//Удалить клиента
export async function deleteClient(clientId) {
  await fetch(`http://localhost:3000/api/clients/${clientId}`, {
    method: "DELETE",
  });
}

//Функция правильного формата времени
function reformTime(date) {
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

//Функия отрисовки клиента
export function renderClient(client) {
  const clientElement = el(
    "li",
    { class: "client list-group-item row d-flex" },
    [
      el("div", { class: "col-2", id: "client-id" }, client.id),
      el(
        "div",
        { class: "col-2" },
        `${client.surname} ${client.name} ${client.lastName}`
      ),
      el(
        "div",
        { class: "col-2" },
        `${reformTime(new Date(client.createdAt)).reformedDate} ${
          reformTime(new Date(client.createdAt)).reformedTime
        }`
      ),
      el(
        "div",
        { class: "col-2" },
        `${reformTime(new Date(client.updatedAt)).reformedDate} ${
          reformTime(new Date(client.updatedAt)).reformedTime
        }`
      ),
      renderContactIcons(client),
      el(
        "div",
        {
          class: "col-2 d-flex justify-content-between",
          "data-client-id": `${client.id}`,
        },
        [
          el(
            "a",
            {
              "data-bs-toggle": "modal",
              "data-bs-target": "#patch-client-modal",
            },
            "изменить"
          ),
          el(
            "a",
            {
              "data-bs-toggle": "modal",
              "data-bs-target": "#delete-client-modal",
            },
            "удалить"
          ),
        ]
      ),
    ]
  );
  return clientElement;
}
