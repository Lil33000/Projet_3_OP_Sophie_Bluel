async function listsImages() {

    // requête GET faite a l'API
    const response = await fetch('http://localhost:5678/api/works'); 

    // on viens recuperer les données JSON en la stockant 
    const projets = await response.json();
    
    // affiche les projets sur la page 
    return getProjets(projets);
  }
  

  function getProjets(projets) {

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; 
  
    projets.forEach(projet => {

      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = projet.imageUrl;
      const figcaption = document.createElement("figcaption");
      figcaption.innerText = projet.title;
  
      figure.appendChild(image);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  }
  
  listsImages();