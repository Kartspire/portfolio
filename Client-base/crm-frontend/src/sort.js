//Сортировка
const compareElements = (a, b, sortId) => {
  return a.childNodes[sortId].textContent > b.childNodes[sortId].textContent ? 1 : -1;
};

export function sortClients(clientsElems, clientsList, switcher, sortId) {
  clientsElems.forEach((elem) => elem.remove());

  if (switcher) {
    clientsElems.sort((a, b) => compareElements(a, b, sortId));
  } else {
    clientsElems.sort((a, b) => compareElements(b, a, sortId));
  }

  clientsElems.forEach((elem) => clientsList.append(elem));
}
