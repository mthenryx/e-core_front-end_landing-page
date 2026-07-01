'use strict'

import { getBebidas } from './bebidas.js'

const containerNaoAlcoolicas = document.getElementById('nao-alcoolicas')
const containerAlcoolicas = document.getElementById('alcoolicas')

let todasBebidas = []
let bebidasAlcoolicas = []
let bebidasNaoAlcoolicas = []
let quantidadeAtual = 0

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function singularizar(valor) {
    const texto = normalizarTexto(valor)

    if (texto.endsWith('es')) {
        return texto.slice(0, -2)
    }

    if (texto.endsWith('s')) {
        return texto.slice(0, -1)
    }

    return texto
}

function listaSegura(valor) {
    return Array.isArray(valor) ? valor : []
}

function valorMoeda(valor) {
    const numero = Number(valor)

    if (Number.isNaN(numero)) {
        return 'R$ 0,00'
    }

    return 'R$ ' + numero.toFixed(2).replace('.', ',')
}

function obterValoresFiltro(bebida) {
    return [
        bebida?.nome,
        bebida?.litragem,
        bebida?.descricao,
        ...listaSegura(bebida?.categoria).map(item => item?.nome_categoria),
        ...listaSegura(bebida?.marca).map(item => item?.nome_marca),
        ...listaSegura(bebida?.sabor).map(item => item?.nome_sabor),
        ...listaSegura(bebida?.caracteristica).map(item => item?.nome),
        ...listaSegura(bebida?.foto_embalagem).map(item => item?.tipo_embalagem)
    ].filter(Boolean)
}

function criarCard(bebida, fotoEmbalagem) {
    const foto = fotoEmbalagem || listaSegura(bebida?.foto_embalagem)[0] || {}
    const marcas = listaSegura(bebida?.marca)
        .map(item => item?.nome_marca)
        .filter(Boolean)
        .join(', ')

    const card = document.createElement('div')
    card.classList.add('card-bebida')

    const topo = document.createElement('div')
    topo.classList.add('topo-card')

    const volume = document.createElement('span')
    volume.classList.add('volume-bebida')
    volume.textContent = bebida?.litragem || ''

    const imagem = document.createElement('img')
    imagem.src = foto.foto || './img/lata-imagem.png'
    imagem.alt = bebida?.nome || 'Bebida'

    topo.append(volume, imagem)

    const conteudo = document.createElement('div')
    conteudo.classList.add('conteudo-bebida')

    const marca = document.createElement('span')
    marca.classList.add('marca-bebida')
    marca.textContent = marcas || 'Sem marca'

    const titulo = document.createElement('h3')
    titulo.textContent = bebida?.nome || 'Bebida'

    const descricao = document.createElement('p')
    descricao.classList.add('descricao')
    descricao.textContent = bebida?.descricao || ''

    const preco = document.createElement('span')
    preco.classList.add('preco-bebida')
    preco.textContent = valorMoeda(foto.valor)

    conteudo.append(marca, titulo, descricao, preco)
    card.append(topo, conteudo)

    return card
}

function verificarSeAlcoolica(bebida) {
    const caracteristicas = listaSegura(bebida?.caracteristica).map(item => normalizarTexto(item?.nome))

    return caracteristicas.some(nome => nome === 'alcoolica' || nome === 'com alcool' || nome === 'alcoolico')
}

function limparContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}

async function atualizarBebidas() {
    try {
        const dados = await getBebidas('bebida')
        todasBebidas = listaSegura(dados?.response?.bebida)
        bebidasAlcoolicas = todasBebidas.filter(verificarSeAlcoolica)
        bebidasNaoAlcoolicas = todasBebidas.filter(bebida => !verificarSeAlcoolica(bebida))
        renderizarNaoAlcoolicas(bebidasNaoAlcoolicas)
        renderizarAlcoolicas(bebidasAlcoolicas)
    } catch (error) {
        console.error(error)
    }
}

async function verificarNovasBebidas() {
    try {
        const dados = await getBebidas('bebida')
        const novaQuantidade = Number(dados?.response?.count || 0)
        if (novaQuantidade !== quantidadeAtual) {
            quantidadeAtual = novaQuantidade
            await atualizarBebidas()
        }
    } catch (error) {
        console.error(error)
    }
}

async function iniciar() {
    try {
        if (!containerNaoAlcoolicas || !containerAlcoolicas) {
            console.error('Containers nao encontrados.')
            return
        }
        const dados = await getBebidas('bebida')
        quantidadeAtual = Number(dados?.response?.count || 0)

        await atualizarBebidas()
        configurarCarrosseis()
        configurarCategorias()

        document.querySelectorAll('[data-categoria="todos"]').forEach(botao => botao.classList.add('ativo'))
        setInterval(verificarNovasBebidas, 3000)
    } catch (error) {
        console.error(error)
    }
}

iniciar()

function configurarCarrosseis() {
    const wrappers = document.querySelectorAll('.wrapper-carrossel')

    wrappers.forEach(wrapper => {
        const btnEsquerda = wrapper.querySelector('.btn-esquerda')
        const btnDireita = wrapper.querySelector('.btn-direita')
        const carrossel = wrapper.querySelector('.carrossel-bebidas')

        btnDireita.addEventListener('click', () => {
            carrossel.scrollBy({ left: carrossel.clientWidth * 0.85, behavior: 'smooth' })
        })

        btnEsquerda.addEventListener('click', () => {
            carrossel.scrollBy({ left: carrossel.clientWidth * -0.85, behavior: 'smooth' })
        })
    })
}

function configurarCategorias() {
    const grupos = document.querySelectorAll('.categorias-bebidas')

    grupos.forEach(grupo => {
        const tipo = grupo.dataset.tipo

        grupo.querySelectorAll('.categoria-btn').forEach(botao => {
            botao.addEventListener('click', () => {
                grupo.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('ativo'))
                botao.classList.add('ativo')
                filtrarCategoria(botao.dataset.categoria, tipo)
            })
        })
    })
}

function renderizarLista(container, lista) {
    limparContainer(container)

    lista.forEach(bebida => {
        const fotos = listaSegura(bebida?.foto_embalagem)

        if (!fotos.length) {
            container.appendChild(criarCard(bebida))
            return
        }

        fotos.forEach(foto => {
            container.appendChild(criarCard(bebida, foto))
        })
    })
}

function renderizarNaoAlcoolicas(lista) {
    renderizarLista(containerNaoAlcoolicas, lista)
}

function renderizarAlcoolicas(lista) {
    renderizarLista(containerAlcoolicas, lista)
}

function bebidaCombinaComFiltro(bebida, filtro) {
    const filtroNormalizado = normalizarTexto(filtro)
    const filtroSingular = singularizar(filtro)

    return obterValoresFiltro(bebida).some(valor => {
        const valorNormalizado = normalizarTexto(valor)

        return valorNormalizado === filtroNormalizado || singularizar(valorNormalizado) === filtroSingular
    })
}

function filtrarCategoria(categoria, tipo) {
    const listaBase = tipo === 'nao-alcoolicas' ? bebidasNaoAlcoolicas : bebidasAlcoolicas

    if (normalizarTexto(categoria) === 'todos') {
        if (tipo === 'nao-alcoolicas') {
            renderizarNaoAlcoolicas(listaBase)
        } else {
            renderizarAlcoolicas(listaBase)
        }

        return
    }

    const bebidasFiltradas = listaBase.filter(bebida => bebidaCombinaComFiltro(bebida, categoria))

    if (tipo === 'nao-alcoolicas') {
        renderizarNaoAlcoolicas(bebidasFiltradas)
    } else {
        renderizarAlcoolicas(bebidasFiltradas)
    }
}
