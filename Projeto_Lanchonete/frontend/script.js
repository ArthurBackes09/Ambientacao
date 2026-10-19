const botaoBuscar = document.getElementById("btnBuscar");
const listaLanches = document.getElementById("listarLanches");
const mensagem = document.getElementById("mensagem");
const totalLanches = document.getElementById("totalLanches");
const totalCategorias = document.getElementById("totalCategorias");
const precoMedio = document.getElementById("precoMedio");
const buscaLanche = document.getElementById("buscarLanche");
const filtroCategoria = document.getElementById("filtrarCategoria");
const categoriasDisponiveis = document.getElementById("categoriasDisponiveis");
const formulario = document.getElementById("formLanches");
const campoNome = document.getElementById("nome");
const campoIngredientes = document.getElementById("ingredientes");
const campoCategoria = document.getElementById("categoria");
const campoPreco = document.getElementById("preco");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

let lanches = [];
let idEdicao = null;

botaoBuscar.addEventListener("click", buscarLanches);
buscaLanche.addEventListener("input", mostrarLanches);
filtroCategoria.addEventListener("change", mostrarLanches);
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

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = tipo ? "mensagem " + tipo : "mensagem";
}

function mostrarResumo() {
    const precos = lanches.map((lanche) => Number(lanche.preco));
    const media = precos.length
        ? precos.reduce((soma, preco) => soma + preco, 0) / precos.length
        : null;
    const categorias = [...new Set(lanches.map((lanche) => lanche.categoria).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "pt-BR"));

    totalLanches.textContent = lanches.length;
    totalCategorias.textContent = categorias.length;
    precoMedio.textContent = media === null
        ? "—"
        : media.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    categoriasDisponiveis.replaceChildren();
    filtroCategoria.replaceChildren();
    const todasCategorias = document.createElement("option");
    todasCategorias.value = "";
    todasCategorias.textContent = "Todas as categorias";
    filtroCategoria.appendChild(todasCategorias);

    for (const categoria of categorias) {
        const opcaoFiltro = document.createElement("option");
        opcaoFiltro.value = categoria;
        opcaoFiltro.textContent = categoria;
        filtroCategoria.appendChild(opcaoFiltro);

        const opcaoFormulario = document.createElement("option");
        opcaoFormulario.value = categoria;
        categoriasDisponiveis.appendChild(opcaoFormulario);
    }

    if (!categorias.includes(filtroCategoria.dataset.selecionada)) {
        filtroCategoria.value = "";
    } else {
        filtroCategoria.value = filtroCategoria.dataset.selecionada;
    }
}

function mostrarEstadoVazio(texto) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 6;
    celula.className = "estado-vazio";
    celula.textContent = texto;
    linha.appendChild(celula);
    listaLanches.replaceChildren(linha);
}

function mostrarLanches() {
    filtroCategoria.dataset.selecionada = filtroCategoria.value;
    const termoBusca = buscaLanche.value.trim().toLocaleLowerCase("pt-BR");
    const categoriaSelecionada = filtroCategoria.value;
    const lanchesFiltrados = lanches.filter((lanche) => {
        const textoLanche = (lanche.nome + " " + lanche.ingredientes).toLocaleLowerCase("pt-BR");
        const correspondeBusca = textoLanche.includes(termoBusca);
        const correspondeCategoria = !categoriaSelecionada || lanche.categoria === categoriaSelecionada;
        return correspondeBusca && correspondeCategoria;
    });

    listaLanches.replaceChildren();

    if (lanchesFiltrados.length === 0) {
        mostrarEstadoVazio(lanches.length === 0
            ? "Nenhum lanche cadastrado. Use o formulário abaixo para adicionar o primeiro."
            : "Nenhum lanche encontrado com esses filtros.");
        return;
    }

    for (const lanche of lanchesFiltrados) {
        const linha = document.createElement("tr");

        for (const valor of [lanche.id, lanche.nome, lanche.ingredientes]) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            if (valor === lanche.nome) {
                celula.className = "nome-lanche";
            } else if (valor === lanche.ingredientes) {
                celula.className = "ingredientes-lanche";
            }
            linha.appendChild(celula);
        }

        const celulaCategoria = document.createElement("td");
        const etiquetaCategoria = document.createElement("span");
        etiquetaCategoria.className = "etiqueta-categoria";
        etiquetaCategoria.textContent = lanche.categoria;
        celulaCategoria.appendChild(etiquetaCategoria);
        linha.appendChild(celulaCategoria);

        const celulaPreco = document.createElement("td");
        celulaPreco.className = "preco-lanche";
        celulaPreco.textContent = Number(lanche.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        linha.appendChild(celulaPreco);

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
}

async function buscarLanches() {
    botaoBuscar.disabled = true;
    mostrarMensagem("Buscando lanches...");

    try {
        const resposta = await fetch("http://localhost:3000/lanches");
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        lanches = await resposta.json();
        mostrarResumo();
        mostrarLanches();
        mostrarMensagem(lanches.length + (lanches.length === 1
            ? " lanche encontrado."
            : " lanches encontrados."));
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar os lanches. Verifique se a API está ligada.", "erro");
        console.error("Erro ao buscar lanches:", erro);
    } finally {
        botaoBuscar.disabled = false;
    }
}

async function editarLanche(id) {
    try {
        const resposta = await fetch("http://localhost:3000/lanches/" + id);
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        campoNome.value = dados.nome;
        campoIngredientes.value = dados.ingredientes;
        campoCategoria.value = dados.categoria;
        campoPreco.value = dados.preco;

        idEdicao = dados.id;
        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.hidden = false;
        tituloFormulario.textContent = "Editar lanche";
        mostrarMensagem("Editando lanche de ID " + dados.id + ".");
        formulario.scrollIntoView({ behavior: "smooth", block: "center" });
        campoNome.focus({ preventScroll: true });
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar os dados do lanche.", "erro");
        console.error("Erro ao carregar lanche:", erro);
    }
}

function cancelarEdicao() {
    formulario.reset();
    idEdicao = null;
    botaoSalvar.textContent = "Cadastrar lanche";
    botaoCancelar.hidden = true;
    tituloFormulario.textContent = "Cadastrar lanche";
}

async function salvarLanche(evento) {
    evento.preventDefault();

    if (idEdicao !== null) {
        await atualizarLanche();
        return;
    }

    const lanche = {
        nome: campoNome.value.trim(),
        ingredientes: campoIngredientes.value.trim(),
        categoria: campoCategoria.value.trim(),
        preco: campoPreco.value
    };

    try {
        const resposta = await fetch("http://localhost:3000/lanches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lanche)
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        cancelarEdicao();
        await buscarLanches();
        mostrarMensagem(dados.mensagem, "sucesso");
    } catch (erro) {
        mostrarMensagem("Não foi possível cadastrar o lanche.", "erro");
        console.error("Erro ao cadastrar lanche:", erro);
    }
}

async function atualizarLanche() {
    const lanche = {
        nome: campoNome.value.trim(),
        ingredientes: campoIngredientes.value.trim(),
        categoria: campoCategoria.value.trim(),
        preco: campoPreco.value
    };

    try {
        const resposta = await fetch("http://localhost:3000/lanches/" + idEdicao, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lanche)
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        cancelarEdicao();
        await buscarLanches();
        mostrarMensagem(dados.mensagem, "sucesso");
    } catch (erro) {
        mostrarMensagem("Não foi possível atualizar o lanche.", "erro");
        console.error("Erro ao atualizar lanche:", erro);
    }
}

async function excluirLanche(id) {
    const confirmar = confirm("Deseja realmente excluir este lanche do cardápio?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/lanches/" + id, {
            method: "DELETE"
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro HTTP: " + resposta.status);
        }

        if (String(idEdicao) === String(id)) {
            cancelarEdicao();
        }
        await buscarLanches();
        mostrarMensagem(dados.mensagem, "sucesso");
    } catch (erro) {
        mostrarMensagem("Não foi possível excluir o lanche.", "erro");
        console.error("Erro ao excluir lanche:", erro);
    }
}

buscarLanches();
