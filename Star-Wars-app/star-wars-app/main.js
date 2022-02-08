const cssPromises = {};

function loadResource(src) {
  if (src.endsWith(".js")) {
    return import(src);
  }

  if (src.endsWith(".css")) {
    if (!cssPromises[src]) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = src;
      cssPromises[src] = new Promise((resolve) => {
        link.addEventListener("load", () => resolve);
      });
      document.head.append(link);
    }
    return cssPromises[src];
  }

  return fetch(src).then((res) => res.json());
}

const appContainer = document.getElementById("app");

async function renderPage(moduleName, apiUrl, css) {
  const [pageModule, data] = await Promise.all(
    [moduleName, apiUrl, css].map((src) => loadResource(src))
  );
  appContainer.innerHTML = "";
  appContainer.append(pageModule.render(data));
}

renderPage(
  "./star-wars-list.js",
  "https://swapi.dev/api/films",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
);

async function loadAndRender(episodeId) {
  if (episodeId) {
    const { render } = await loadResource("./star-wars-details.js");
    loadResource(
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    );
    const data = await loadResource(`https://swapi.dev/api/films/${episodeId}`);
    document
      .querySelector("#app")
      .append(
        render(
          data,
          await urlsToDataArray(data.planets),
          await urlsToDataArray(data.species)
        )
      );
  } else {
    const { render } = await loadResource("./star-wars-list.js");
    loadResource(
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    );
    const data = await loadResource("https://swapi.dev/api/films");
    document.querySelector("#app").append(render(data.results));
  }
}

async function urlsToDataArray(urlsArray) {
  const cuArr = await Promise.all(urlsArray.map((res) => loadResource(res)));
  return cuArr;
}

async function fillDom() {
  const searchParams = new URLSearchParams(location.search);
  const episodeId = searchParams.get("episodeId");
  await loadAndRender(episodeId);

  document.querySelectorAll(".js-link").forEach((el) =>
    el.addEventListener("click", async () => {
      appContainer.innerHTML = "";
      const searchParams = new URLSearchParams(location.search);
      const episodeId = searchParams.get("episodeId");
      fillDom();
    })
  );
}

fillDom();

window.addEventListener("popstate", () => {
  appContainer.innerHTML = "";
  const searchParams = new URLSearchParams(location.search);
  const episodeId = searchParams.get("episodeId");
  fillDom(episodeId);
});
