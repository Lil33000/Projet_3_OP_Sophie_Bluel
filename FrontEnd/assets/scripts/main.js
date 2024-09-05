//* AFFICHER ET FILTRER PAR CATEGORIE LES PROJETS *\\

async function listsImages() {
  try {
    // récupération des projects via l'API
    const response = await fetch("http://localhost:5678/api/works");
    const projets = await response.json();

    const categories = await renderCategories();

    renderFilterButtons(categories);
    setupFilterButtons(projets);
    renderProjets(projets);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

const renderCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");

  return await response.json();
};

const renderProjets = (projets) => {
  document.querySelector(".gallery").innerHTML = projets
    .map(
      (projet) => `
    <figure>
      <img src="${projet.imageUrl}" alt="${projet.title}">
      <figcaption>${projet.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

const filterProjets = (projets, category) => {
  return category === "all"
    ? projets
    : projets.filter((projet) => projet.categoryId == category);
};

const renderFilterButtons = (categories) => {
  const filterButton = document.querySelector("#filter-btn");
  filterButton.innerHTML = "";

  filterButton.innerHTML += `
    <button data-category="all" class="active">Tous</button>
  `;

  categories.forEach((category) => {
    filterButton.innerHTML += `
      <button data-category="${category.id}">${category.name}</button>
    `;
  });
};

const setupFilterButtons = (projets) => {
  const buttons = document.querySelectorAll("#filter-btn button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const filteredProjets = filterProjets(projets, button.dataset.category);
      renderProjets(filteredProjets);
    });
  });
};

listsImages();
