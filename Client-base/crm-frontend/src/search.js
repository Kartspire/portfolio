let timerId;

const findClient = (client, searchingClient) => {
  if (client.querySelector('.fio').textContent.toLowerCase().includes(searchingClient)) {
    client.classList.remove('d-none');
  } else {
    client.classList.add('d-none');
  }
};

const searchClient = (e, clientsElems) => {
  const searchingClient = e.target.value.toLowerCase();
  clientsElems.forEach((client) => {
    findClient(client, searchingClient);
  });
};

export function searchClientDelay(e, clientsElems) {
  timerId = setTimeout(() => searchClient(e, clientsElems), 500);
}
export function clearSearchClient() {
  clearInterval(timerId);
}
