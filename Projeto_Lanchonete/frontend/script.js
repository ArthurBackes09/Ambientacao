const API_URL = "http://localhost:3000/lanches";

const botaoBuscar = document.getElementById("btnBuscar");
const listaLanches = document.getElementById("listarLanches");
const mensagem = document.getElementById("mensagem");
const totalLanches = document.getElementById("totalLanches");
const formulario = document.getElementById("formLanches");
const campoNome = document.getElementById("nome");
const campoIngredientes = document.getElementById("ingredientes");
const campoCategoria = document.getElementById("categoria");
const campoPreco = document.getElementById("preco");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

let idEdicao = null;

botaoBuscar.addEventListener("click", buscarLanches);
formulario.addEventListener("submit", salvarLanche);
botaoCancelar.addEventListener("click", cancelarEdicao);

listaLanches.addEventListener("click", (evento) => {
    const botaoEditar = evento.target.closest("[data-id-edicao]");
    if (botaoEditar) {
        editarLanche(botaoEditar.dataset.idEdicao);
        return;
    }

    const botaoExcluir = evento.target.closest("[data-id-excluir]");
    if (botaoExcluir) {
        excluirLanche(botaoExcluir.dataset.idExcluir);
    }
});

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function adicionarCelula(linha, valor, classe = "") {
    const celula = document.createElement("td");
    celula.textContent = valor;
    if (classe) {
        celula.className = classe;
    }
    linha.appendChild(celula);
}

function mostrarEstadoVazio(texto) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 5;
    celula.className = "estado-vazio";
    celula.textContent = texto;
    linha.appendChild(celula);
    listaLanches.replaceChildren(linha);
}

async function buscarLanches() {
    try {
        mensagem.textContent = "Carregando cardápio...";
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const lanches = await resposta.json();
        listaLanches.replaceChildren();
        totalLanches.textContent = lanches.length;

        if (lanches.length === 0) {
            mostrarEstadoVazio("Seu cardápio ainda está vazio. Cadastre o primeiro lanche abaixo!");
            mensagem.textContent = "Nenhum lanche cadastrado.";
            return;
        }

        for (const lanche of lanches) {
            const linha = document.createElement("tr");
            adicionarCelula(linha, lanche.nome, "nome-lanche");
            adicionarCelula(linha, lanche.ingredientes, "ingredientes-lanche");

            const celulaCategoria = document.createElement("td");
            const etiqueta = document.createElement("span");
            etiqueta.className = "etiqueta-categoria";
            etiqueta.textContent = lanche.categoria;
            celulaCategoria.appendChild(etiqueta);
            linha.appendChild(celulaCategoria);

            adicionarCelula(linha, formatarPreco(lanche.preco), "preco-lanche");

            const celulaAcoes = document.createElement("td");
            celulaAcoes.className = "acoes";

            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.className = "botao-acao";
            botaoEditar.dataset.idEdicao = lanche.id;
            botaoEditar.textContent = "Editar";
            celulaAcoes.appendChild(botaoEditar);

            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.className = "botao-acao botao-acao-excluir";
            botaoExcluir.dataset.idExcluir = lanche.id;
            botaoExcluir.textContent = "Excluir";
            celulaAcoes.appendChild(botaoExcluir);

            linha.appendChild(celulaAcoes);
            listaLanches.appendChild(linha);
        }

        mensagem.textContent = lanches.length === 1
            ? "1 lanche no cardápio."
            : `${lanches.length} lanches no cardápio.`;
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar os lanches. Verifique se a API está ligada.";
        console.error("Erro ao buscar lanches:", erro);
    }
}

async function editarLanche(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        const lanche = await resposta.json();
        if (!resposta.ok) {
            throw new Error(lanche.mensagem || "Erro HTTP: " + resposta.status);
        }

        campoNome.value = lanche.nome;
        campoIngredientes.value = lanche.ingredientes;
        campoCategoria.value = lanche.categoria;
        campoPreco.value = lanche.preco;
        idEdicao = lanche.id;
        botaoSalvar.innerHTML = "Salvar alterações <span aria-hidden=\"true\">→</span>";
        botaoCancelar.hidden = false;
        tituloFormulario.textContent = "Editar lanche";
        mensagem.textContent = `Editando ${lanche.nome}.`;
        formulario.scrollIntoView({ behavior: "smooth", block: "center" });
        campoNome.focus({ preventScroll: true });
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar os dados do lanche.";
        console.error("Erro ao carregar lanche:", erro);
    }
}

function cancelarEdicao() {
    idEdicao = null;
    formulario.reset();
    botaoSalvar.innerHTML = "Adicionar ao cardápio <span aria-hidden=\"true\">→</span>";
    botaoCancelar.hidden = true;
    tituloFormulario.textContent = "Adicionar um lanche";
}

async function salvarLanche(evento) {
    evento.preventDefault();
    const lanche = {
        nome: campoNome.value.trim(),
        ingredientes: campoIngredientes.value.trim(),
        categoria: campoCategoria.value,
        preco: Number(campoPreco.value)
    };

    const editando = idEdicao !== null;
    try {
        const resposta = await fetch(editando ? `${API_URL}/${idEdicao}` : API_URL, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lanche)
        });
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        cancelarEdicao();
        await buscarLanches();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = editando
            ? "Não foi possível atualizar o lanche."
            : "Não foi possível cadastrar o lanche.";
        console.error("Erro ao salvar lanche:", erro);
    }
}

async function excluirLanche(id) {
    if (!confirm("Deseja realmente excluir este lanche do cardápio?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        if (String(idEdicao) === String(id)) {
            cancelarEdicao();
        }
        await buscarLanches();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível excluir o lanche.";
        console.error("Erro ao excluir lanche:", erro);
    }
}

buscarLanches();
