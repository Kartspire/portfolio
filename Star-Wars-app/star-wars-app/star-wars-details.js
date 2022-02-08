export function render(data, planets, species) {
  const container = document.createElement("div");
  container.classList.add("container");

  const h1 = document.createElement("h1");
  h1.classList.add("h1", "mb-3");
  h1.textContent = `${data.title} - ${data.episode_id} episode`;

  const link = document.createElement("a");
  link.classList.add("btn", "btn-outline-primary", "mb-3", "js-link");
  link.textContent = "back to episodes";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    history.pushState({}, "", window.location.pathname);
  });

  const paragraph = document.createElement("p");
  paragraph.textContent = data.opening_crawl;
  paragraph.classList.add("mb-3");

  const planetHeader = document.createElement("h2");
  planetHeader.classList.add("h2", "mb-1");
  planetHeader.textContent = "Planets";
  const planetList = document.createElement("ul");
  planetList.classList.add("list-group", "mb-3");
  for (let el of planets) {
    const planetListItem = document.createElement("li");
    planetListItem.classList.add("list-group-item");
    planetListItem.textContent = el.name;
    planetList.append(planetListItem);
  }

  const speciesHeader = document.createElement("h2");
  speciesHeader.classList.add("h2", "mb-1");
  speciesHeader.textContent = "Species";
  const speciesList = document.createElement("ul");
  speciesList.classList.add("list-group");
  for (let el of species) {
    const speciesListItem = document.createElement("li");
    speciesListItem.classList.add("list-group-item");
    speciesListItem.textContent = el.name;
    speciesList.append(speciesListItem);
  }

  container.append(h1);
  container.append(link);
  container.append(paragraph);
  container.append(planetHeader);
  container.append(planetList);
  container.append(speciesHeader);
  container.append(speciesList);
  return container;
}
