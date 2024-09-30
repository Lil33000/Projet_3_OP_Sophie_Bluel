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

      const filteredProjects = filterProjects(
        projects,
        button.dataset.category
      );
      renderProjects(filteredProjects);
    });
  });
};

const renderProjects = (projects) => {
  document.querySelector(".gallery").innerHTML = projects
    .map(
      (project) => `
    <figure data-id="${project.id}">
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

//* AFFICHER LA BARRE EDIT, LE BOUTON MODIFIER ET CACHER LES CATEGORIES SI CONNECTÉ *\\

function showOptionsAdmin(projects) {
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

  editLink.addEventListener("click", function (event) {
    event.preventDefault();
    openModal(projects);
  });
}

//* AFFICHER MODAL POUR SUPPRIMER LES PROJETS ET AJOUTER UNE PHOTO *\\

function openModal(projects) {
  const modal = document.getElementById("edit-modal");
  const modalGallery = document.querySelector(".modal-gallery");
  modal.style.display = "block";

  modalGallery.innerHTML = projects
    .map(
      (project) => `
      <figure data-id="${project.id}">
        <img src="${project.imageUrl}" alt="${project.title}">
        <i class="fas fa-trash delete-icon" data-id="${project.id}"></i>
      </figure>
    `
    )
    .join("");

  const closeModal = document.querySelector(".modal .close");
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  const deleteIcons = document.querySelectorAll(".delete-icon");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const projectId = icon.getAttribute("data-id");
      const projectElement = icon.parentElement;
      deleteProject(projectId, projectElement);
    });
  });

  document
    .getElementById("add-photo-btn")
    .addEventListener("click", function () {
      document.querySelector(".modal-title").style.display = "none";
      document.querySelector(".separator").style.display = "none";
      document.querySelector(".modal-gallery").style.display = "none";
      document.getElementById("add-photo-btn").style.display = "none";
      document.getElementById("add-photo-form").style.display = "block";
    });

  document.getElementById("back-arrow").addEventListener("click", function () {
    document.querySelector(".modal-title").style.display = "block";
    document.querySelector(".separator").style.display = "block";
    document.querySelector(".modal-gallery").style.display = "block";
    document.getElementById("add-photo-btn").style.display = "block";
    document.getElementById("add-photo-form").style.display = "none";
  });

  document.getElementById('photo-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader(); 
        reader.onload = function(e) {
            const previewBox = document.getElementById('upload-box-preview');
            previewBox.innerHTML = `<img src="${e.target.result}" alt="Aperçu de l'image sélectionnée">`;
        };
        reader.readAsDataURL(file);
    }
});

  async function fetchCategories() {
    const categories = await renderCategories();
    const categorySelect = document.getElementById("photo-category");

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }

  fetchCategories();

  document
    .getElementById("new-photo-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const title = document.getElementById("photo-title").value;
      const category = document.getElementById("photo-category").value;
      const fileInput = document.getElementById("photo-file");
      const file = fileInput.files[0];

      if (!file) {
        alert("Veuillez choisir une photo.");
        return;
      }
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("image", file);

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          alert("Photo ajoutée avec succès !");
          
          document.getElementById("new-photo-form").reset();
          
          const previewBox = document.getElementById('upload-box-preview');
          previewBox.innerHTML = `
            <i class="fas fa-image"></i>
            <span>+ Ajouter photo</span>
            <small>jpg, png : 4mo max</small>
          `;
    
        } else {
          alert("Erreur lors de l'ajout de la photo.");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de la photo :", error);
      }
    });
}

//* FONCTION POUR SUPPRIMER LES PROJETS *\\

async function deleteProject(projectId, projectElement) {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `http://localhost:5678/api/works/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      projectElement.remove();
      const galleryProject = document.querySelector(
        `.gallery figure[data-id='${projectId}']`
      );
      if (galleryProject) {
        galleryProject.remove();
      }
    } else {
      alert("Erreur lors de la suppression du projet.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}


listsImages();
