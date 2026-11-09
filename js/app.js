/**
 * Página do formulário (index.html).
 * Lê os dados do formulário e (futuramente) envia para a API.
 */
const formulario = document.querySelector('#form-perfil');
const modal = document.querySelector('#modal-indisponivel');
const botaoEnviar = formulario.querySelector('button[type="submit"]');
const mensagemModal = document.querySelector('#modal-mensagem');

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

function mostrarModal(mensagem) {
  mensagemModal.textContent = mensagem;
  modal.showModal();
}

function definirCarregando(carregando) {
  botaoEnviar.disabled = carregando;
  botaoEnviar.textContent = carregando ? 'Enviando...' : 'Descobrir minha carreira';
}

async function enviarPerfil(perfil) {
  const resposta = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(perfil),
    signal: AbortSignal.timeout(CONFIG.TEMPO_LIMITE_MS),
  });

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}`);
  }

  return resposta.json();
}

formulario.addEventListener('submit', async (evento) => {
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
  if (!CONFIG.API_URL) {
    mostrarModal('O serviço de mapeamento ainda não está disponível. Seus dados não foram enviados. Volte em breve!');
    return;
  }

  definirCarregando(true);

  try {
    const resultado = await enviarPerfil(perfil);
    sessionStorage.setItem('resultado', JSON.stringify(resultado));
    window.location.href = 'resultado.html';
  } catch (erro) {
    console.error('Falha ao enviar o perfil:', erro);
    const demorou = erro.name === 'TimeoutError';
    mostrarModal(
      demorou
        ? 'O serviço demorou demais para responder. Seus dados continuam no formulário, tente de novo em instantes.'
        : 'Não foi possível analisar seu perfil agora. Seus dados continuam no formulário, tente de novo em instantes.'
    );
    definirCarregando(false);
  }
});

formulario.addEventListener('input', (evento) => {
  if (evento.target.hasAttribute('aria-invalid')) {
    definirErro(evento.target, '');
  }
});
