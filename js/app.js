/**
 * Página do formulário (index.html).
 * Lê os dados do formulário e (futuramente) envia para a API.
 */
const formulario = document.querySelector('#form-perfil');

function lerLista(texto) {
  return texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const campos = formulario.elements;
const nome = campos.nome.value.trim();
const hobbies = lerLista(campos.hobbies.value);
const interesses = lerLista(campos.interesses.value);

 if (!nome || hobbies.length === 0 || interesses.length === 0) {
  alert('Preencha nome, hobbies e interesses.');
  return;
  }

  const perfil = {
    name: nome,
    hobbies: hobbies,
    interests: interesses,
  };

  console.log('Perfil montado:', perfil);

  // TODO: enviar o perfil para a API configurada em CONFIG.API_URL
  // e levar o usuário para a página resultado.html.
  alert('Tente mais tarde');
});
