async function Test() {
  console.log("test");

  const reponse = await fetch("http://localhost:5678/api/works");

  const projet = await reponse.json();

  console.log(projet);

  return (projet);
}
Test();
