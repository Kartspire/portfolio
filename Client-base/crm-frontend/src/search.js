let timerId;

const findClient = (client, searchingClient) => {
  if (client.childNodes[1].textContent.split(' ')[0].toLowerCase().startsWith(searchingClient)) {
    client.classList.remove('d-none');
  } else {
    client.classList.add('d-none');
  }
};

function searchClient(e, clientsElems) {
  const searchingClient = e.target.value.toLowerCase();
  clientsElems.forEach((client) => {
    findClient(client, searchingClient);
  });
}

export function searchClientDelay(e, clientsElems) {
  timerId = setTimeout(() => {
    searchClient(e, clientsElems);
  }, 500);
}
export function clearSearchClient() {
  clearInterval(timerId);
}
