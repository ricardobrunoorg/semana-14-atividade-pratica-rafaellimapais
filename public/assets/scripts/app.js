const containerCards = document.getElementById('container-cards');
const btnTodas = document.getElementById('btn-todas');
const inputBusca = document.getElementById('input-busca');
const containerBotoes = document.getElementById('container-botoes');
const modalDetalhes = document.getElementById('modal-detalhes');
const modalCorpo = document.getElementById('modal-corpo');
const btnFecharModal = document.getElementById('fechar-modal');

let listaCidadesGlobal = [];

async function buscarCidades() {
    try {
        const response = await fetch('http://localhost:3000/cidades');
        if (!response.ok) {
            throw new Error('Não foi possível conectar ao servidor.');
        }
        listaCidadesGlobal = await response.json();
        renderizarCards(listaCidadesGlobal);
        gerarBotoesFiltro();
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        containerCards.innerHTML = `
            <p class="erro">
                Ops! Não conseguimos carregar os destinos. <br>
                Certifique-se de que o seu json-server está rodando com 'npm start'.
            </p>`;
    }
}

function renderizarCards(listaCidades) {
    containerCards.innerHTML = '';

    if (listaCidades.length === 0) {
        containerCards.innerHTML = '<p class="aviso">Nenhuma cidade encontrada.</p>';
        return;
    }

    listaCidades.forEach(cidade => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const descricaoFinal = cidade.descricaoCurta || cidade.descricao || 'Sem descrição disponível.';

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${cidade.imagem}" alt="Imagem de ${cidade.nome}">
            </div>
            <div class="card-corpo">
                <span class="categoria">${cidade.categoria}</span>
                <h3>${cidade.nome}</h3>
                <p class="descricao">${descricaoFinal}</p>
                <div class="card-footer">
                    <span class="preco">R$ ${cidade.preco}</span>
                    <div class="tags">
                        ${cidade.tags ? cidade.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => abrirDetalhes(cidade));
        containerCards.appendChild(card);
    });
}

function abrirDetalhes(cidade) {
    if (!modalDetalhes || !modalCorpo) return;

    const descricaoCompleta = cidade.descricaoLonga || cidade.descricaoCurta || cidade.descricao || 'Sem detalhes adicionais.';

    modalCorpo.innerHTML = `
        <img class="modal-detalhes-img" src="${cidade.imagem}" alt="${cidade.nome}">
        <span class="modal-categoria">${cidade.categoria}</span>
        <h2>${cidade.nome}</h2>
        <p class="modal-descricao">${descricaoCompleta}</p>
        <div class="modal-info-adicional">
            <p><strong>Preço do Pacote:</strong> R$ ${cidade.preco}</p>
            <p><strong>Tags de Interesse:</strong> ${cidade.tags ? cidade.tags.join(', ') : 'Nenhuma'}</p>
        </div>
    `;

    modalDetalhes.classList.remove('hidden');
}

if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => {
        modalDetalhes.classList.add('hidden');
    });
}

if (modalDetalhes) {
    window.addEventListener('click', (e) => {
        if (e.target === modalDetalhes) {
            modalDetalhes.classList.add('hidden');
        }
    });
}

function gerarBotoesFiltro() {
    if (!containerBotoes) return;

    const botoesExistentes = containerBotoes.querySelectorAll('.btn-filtro');
    botoesExistentes.forEach(btn => btn.remove());

    const categoriesLimpas = [...new Set(listaCidadesGlobal.map(cidade => cidade.categoria))];

    categoriesLimpas.forEach(categoria => {
        const botao = document.createElement('button');
        botao.className = 'btn-filtro';
        botao.textContent = categoria.toLowerCase();

        botao.addEventListener('click', (e) => {
            e.stopPropagation();
            const filtradas = listaCidadesGlobal.filter(cidade => cidade.categoria === categoria);
            renderizarCards(filtradas);
            if (inputBusca) inputBusca.value = '';
        });

        containerBotoes.appendChild(botao);
    });
}

if (inputBusca) {
    inputBusca.addEventListener('input', () => {
        const termoBusca = inputBusca.value.toLowerCase();
        const filtradas = listaCidadesGlobal.filter(cidade => 
            cidade.nome.toLowerCase().includes(termoBusca) || 
            cidade.categoria.toLowerCase().includes(termoBusca)
        );
        renderizarCards(filtradas);
    });
}

if (btnTodas) {
    btnTodas.addEventListener('click', () => {
        renderizarCards(listaCidadesGlobal);
        if (inputBusca) inputBusca.value = '';
    });
}

window.addEventListener('DOMContentLoaded', buscarCidades);