/**
 * Página de resultado (resultado.html).
 *
 * Objetivo: ler o JSON que a API devolveu e mostrar o perfil na tela.
 * Para testar SEM o backend, abra: resultado.html?exemplo
 * (os dados de teste estão em js/dados-exemplo.js, na constante DADOS_EXEMPLO).
 *
 * O HTML já tem tudo o que você precisa:
 *   - #resultado ............ seção que mostra o perfil (começa escondida)
 *   - #sem-resultado ........ seção para quando não há dados (começa escondida)
 *   - #nome-usuario, #sintese, #lista-carreiras
 *   - <template id="modelo-carreira"> ... modelo de card para clonar
 *
 * Formato do JSON: veja o README.md, seção "Contrato da API".
 */

// TODO 1: descobrir de onde vêm os dados
//   - se a URL tiver ?exemplo, use DADOS_EXEMPLO
//   - senão, leia o que o formulário salvou no sessionStorage (CONFIG.CHAVE_RESULTADO)

// TODO 2: se não houver dados válidos, mostre a seção #sem-resultado

// TODO 3: se houver dados, preencha nome e síntese e, para cada carreira,
//   clone o <template>, preencha título, nota, resumo, competências e roteiro
//   e adicione na lista #lista-carreiras. A primeira carreira é a "Melhor combinação".
//   Dica: use textContent (e não innerHTML) para colocar textos vindos da API.

const secaoResultado = document.querySelector('#resultado');
const secaoSemResultado = document.querySelector('#sem-resultado');
const nomeUsuario = document.querySelector('#nome-usuario');
const sintese = document.querySelector('#sintese');
const listaCarreiras = document.querySelector('#lista-carreiras');
const modeloCarreira = document.querySelector('#modelo-carreira');

function obterDados() {
  if (location.search.includes('exemplo')) {
    return DADOS_EXEMPLO;
  }

  try {
    return JSON.parse(sessionStorage.getItem('resultado'));
  } catch {
    return null;
  }
}

function criarCartao(carreira, indice) {
  const cartao = modeloCarreira.content.cloneNode(true);

  cartao.querySelector('.carreira__titulo').textContent = carreira.title;
  cartao.querySelector('.carreira__percentual').textContent = `${carreira.match_score}%`;
  cartao.querySelector('.barra__nivel').style.setProperty('--nivel', `${carreira.match_score}%`);
  cartao.querySelector('.carreira__resumo').textContent = carreira.summary;

  carreira.key_skills.forEach((competencia) => {
    const item = document.createElement('li');
    item.textContent = competencia;
    cartao.querySelector('.chips').append(item);
  });

  carreira.learning_path.forEach((passo) => {
    const item = document.createElement('li');
    item.textContent = passo;
    cartao.querySelector('.roteiro').append(item);
  });

  if (indice === 0) {
    cartao.querySelector('.carreira__selo').hidden = false;
    cartao.querySelector('.carreira').classList.add('carreira--principal');
  }

  return cartao;
}

function exibirResultado(dados) {
  nomeUsuario.textContent = dados.user_name;
  sintese.textContent = dados.career_identity_statement;

  const carreiras = [...dados.recommended_careers]
    .sort((a, b) => b.match_score - a.match_score);

  carreiras.forEach((carreira, indice) => {
    listaCarreiras.append(criarCartao(carreira, indice));
  });

  secaoResultado.hidden = false;
}

const dados = obterDados();

if (dados && Array.isArray(dados.recommended_careers)) {
  exibirResultado(dados);
} else {
  secaoSemResultado.hidden = false;
}
