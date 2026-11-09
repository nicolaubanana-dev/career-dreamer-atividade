/**
 * Página do formulário (index.html).
 * Lê os dados do formulário e (futuramente) envia para a API.
 */
const formulario = document.querySelector('#form-perfil');
const modal = document.querySelector('#modal-indisponivel');

function lerLista(texto) {
  return texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function definirErro(campo, mensagem) {
  const aviso = document.querySelector(`#erro-${campo.id}`);
  aviso.textContent = mensagem;
  aviso.hidden = mensagem === '';

  if (mensagem) {
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.removeAttribute('aria-invalid');
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const campos = formulario.elements;
const nome = campos.nome.value.trim();
const hobbies = lerLista(campos.hobbies.value);
const interesses = lerLista(campos.interesses.value);

  definirErro(campos.nome, nome ? '' : 'Informe seu nome.');
  definirErro(campos.hobbies, hobbies.length ? '' : 'Informe pelo menos um hobby, separado por vírgula.');
  definirErro(campos.interesses, interesses.length ? '' : 'Informe pelo menos uma área de interesse, separada por vírgula.');

  const primeiroInvalido = formulario.querySelector('[aria-invalid="true"]');
  if (primeiroInvalido) {
    primeiroInvalido.focus();
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
 modal.showModal();
});

formulario.addEventListener('input', (evento) => {
  if (evento.target.hasAttribute('aria-invalid')) {
    definirErro(evento.target, '');
  }
});
