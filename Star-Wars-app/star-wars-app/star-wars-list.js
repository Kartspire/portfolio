export function render(data) {
  const container = document.createElement("div");
  container.classList.add(
    "container",
    "d-flex",
    "justify-content-between",
    "flex-wrap",
    "py-4"
  );
  let buttonId = 0;

  for (let episode of data) {
    const episodeCard = document.createElement("div");
    const cardBody = document.createElement("div");
    const title = document.createElement("h5");
    const number = document.createElement("p");
    const detailsButtoon = document.createElement("a");
    detailsButtoon.id = buttonId++;

    episodeCard.style.width = "15%";
    episodeCard.classList.add("card", "my-2");
    cardBody.classList.add("card-body", "d-flex", "flex-column");
    title.classList.add("card-title", "flex-grow-1");
    number.classList.add("card-text");
    detailsButtoon.classList.add("btn", "btn-primary", "js-link");

    title.textContent = episode.title;
    number.textContent = `${episode.episode_id} episode`;
    detailsButtoon.textContent = "more";
    const url = new URL(window.location);
    url.searchParams.set("episodeId", Number(detailsButtoon.id) + 1);
    detailsButtoon.addEventListener("click", (event) => {
      event.preventDefault();
      history.pushState({}, "", url);
    });

    episodeCard.append(cardBody);
    cardBody.append(title);
    cardBody.append(number);
    cardBody.append(detailsButtoon);
    container.append(episodeCard);
  }
  return container;
}
