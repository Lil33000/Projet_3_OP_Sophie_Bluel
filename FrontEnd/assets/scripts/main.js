//* AFFICHER ET FILTRER PAR CATEGORIE LES PROJETS *\\

async function listsImages() {
  try {
   
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    const token = localStorage.getItem("authToken");

    if (token) {
      showOptionsAdmin(projects);
    } else {
      const categories = await renderCategories();
      renderFilterButtons(categories);
      setupFilterButtons(projects);
    }

    renderProjects(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

const renderCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");

  return await response.json();
};



const filterProjects = (projects, category) => {
  return category === "all"
    ? projects
    : projects.filter((project) => project.categoryId == category);
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

const setupFilterButtons = (projects) => {
  const buttons = document.querySelectorAll("#filter-btn button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const filteredProjects = filterProjects(projects, button.dataset.category);
      renderProjects(filteredProjects);
    });
  });
};
const renderProjects = (projects) => {
  document.querySelector(".gallery").innerHTML = projects
    .map(
      (project) => `
    <figure>
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

//* AFFICHER LA BARRE NOIRE, LE BOUTON MODIFIER ET CACHER LES CATEGORIES SI CONNECTÉ *\\

function showOptionsAdmin() {

  const filterButton = document.querySelector("#filter-btn");
  filterButton.style.display = "none"; 

  const loginLink = document.querySelector("nav ul li:nth-child(3)");
  loginLink.innerHTML = `<a href="#" id="logout">logout</a>`;

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("authToken");
    window.location.reload(); 
  });

  const editBar = document.createElement("div");
  editBar.classList.add("edit-bar");
  editBar.innerHTML = `<i class="fas fa-edit"></i> Mode Édition`;
  
  document.body.appendChild(editBar);
 

  const portfolioHeader = document.querySelector("#portfolio h2");
  const editLink = document.createElement("a");
  editLink.innerHTML = `<i class="fas fa-edit"></i> modifier`; 
  editLink.href = "#";
  editLink.id = "edit-projects";
  
 
  const container = document.createElement("div");
  container.classList.add("container");

  
  portfolioHeader.parentNode.insertBefore(container, portfolioHeader);
  container.appendChild(portfolioHeader);
  container.appendChild(editLink);
}

listsImages();
