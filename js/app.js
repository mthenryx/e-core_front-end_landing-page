'use strict'

import { getBebidas } from './bebidas.js'

const containerNaoAlcoolicas = document.getElementById('nao-alcoolicas')
const containerAlcoolicas = document.getElementById('alcoolicas')

let todasBebidas = []
let bebidasAlcoolicas = []
let bebidasNaoAlcoolicas = []
let quantidadeAtual = 0

function criarCard(bebida) {

    const foto = bebida.foto_embalagem[0]

    const marcas = bebida.marca.map(item => item.nome_marca).join(', ')

    const card = document.createElement('div')
    card.classList.add('card-bebida')

    const topo = document.createElement('div')
    topo.classList.add('topo-card')

    const volume = document.createElement('span')
    volume.classList.add('volume-bebida')
    volume.textContent = bebida.litragem

    const imagem = document.createElement('img')
    imagem.src = foto.foto
    imagem.alt = bebida.nome

    topo.append(volume, imagem)

    const conteudo = document.createElement('div')
    conteudo.classList.add('conteudo-bebida')

    const marca = document.createElement('span')
    marca.classList.add('marca-bebida')
    marca.textContent = marcas

    const titulo = document.createElement('h3')
    titulo.textContent = bebida.nome

    const descricao = document.createElement('p')
    descricao.classList.add('descricao')
    descricao.textContent = bebida.descricao

    const preco = document.createElement('span')
    preco.classList.add('preco-bebida')
    preco.textContent = `R$ ${Number(foto.valor).toFixed(2).replace('.', ',')}`

    conteudo.append(marca, titulo, descricao, preco)

    card.append(topo, conteudo)

    return card
}

function verificarSeAlcoolica(bebida) {

    return bebida.caracteristica.some(
        item => item.nome.toLowerCase() === 'com álcool'
    )
}

function limparContainer(container) {

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}

async function atualizarBebidas() {
    try {
        const dados = await getBebidas('bebida')
        todasBebidas = dados.response.bebida
        bebidasAlcoolicas = todasBebidas.filter(verificarSeAlcoolica)
        bebidasNaoAlcoolicas = todasBebidas.filter(
            bebida => !verificarSeAlcoolica(bebida)
        )
        renderizarNaoAlcoolicas(bebidasNaoAlcoolicas)
        renderizarAlcoolicas(bebidasAlcoolicas)
    } catch (error) {
    }
}

async function verificarNovasBebidas() {
    try {
        const dados = await getBebidas('bebida')
        const novaQuantidade = dados.response.count
        if (novaQuantidade !== quantidadeAtual) {
            quantidadeAtual = novaQuantidade
            await atualizarBebidas()
        }

    } catch (error) {
    }
}

async function iniciar() {
    try {
        if (!containerNaoAlcoolicas || !containerAlcoolicas) {
            console.error('Containers não encontrados.')
            return
        }
        const dados = await getBebidas('bebida')
        quantidadeAtual = dados.response.count

        await atualizarBebidas()
        configurarCarrosseis()
        configurarCategorias()

        document.querySelectorAll('[data-categoria="todos"]').forEach(botao => botao.classList.add('ativo'))

        setInterval(verificarNovasBebidas, 3000)

    } catch (error) {
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
            carrossel.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-30px)' },
                    { transform: 'translateX(0)' }
                ],
                {
                    duration: 300,
                    easing: 'ease'
                }
            )
            setTimeout(() => {

                const primeiro = carrossel.firstElementChild

                if (primeiro) {
                    carrossel.appendChild(primeiro)
                }

            }, 150)
        })

        btnEsquerda.addEventListener('click', () => {
            carrossel.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(30px)' },
                    { transform: 'translateX(0)' }
                ],
                {
                    duration: 300,
                    easing: 'ease'
                }
            )
            setTimeout(() => {

                const ultimo = carrossel.lastElementChild

                if (ultimo) {
                    carrossel.prepend(ultimo)
                }

            }, 150)
        })
    })
}

function configurarCategorias() {

    const grupos = document.querySelectorAll('.categorias-bebidas')

    grupos.forEach(grupo => {

        const tipo = grupo.dataset.tipo

        grupo.querySelectorAll('.categoria-btn').forEach(botao => {

            botao.addEventListener('click', () => {

                grupo.querySelectorAll('.categoria-btn')
                    .forEach(btn => btn.classList.remove('ativo'))

                botao.classList.add('ativo')

                filtrarCategoria(
                    botao.dataset.categoria,
                    tipo
                )
            })
        })
    })
}

function renderizarNaoAlcoolicas(lista) {

    limparContainer(containerNaoAlcoolicas)

    lista.forEach(bebida => {
        containerNaoAlcoolicas.appendChild(
            criarCard(bebida)
        )
    })
}

function renderizarAlcoolicas(lista) {

    limparContainer(containerAlcoolicas)

    lista.forEach(bebida => {
        containerAlcoolicas.appendChild(
            criarCard(bebida)
        )
    })
}

function filtrarCategoria(categoria, tipo) {

    let listaBase = []

    if (tipo === 'nao-alcoolicas') {
        listaBase = bebidasNaoAlcoolicas
    } else {
        listaBase = bebidasAlcoolicas
    }

    if (categoria === 'todos') {

        if (tipo === 'nao-alcoolicas') {
            renderizarNaoAlcoolicas(listaBase)
        } else {
            renderizarAlcoolicas(listaBase)
        }

        return
    }

    const bebidasFiltradas = listaBase.filter(bebida => {

        return bebida.categoria.some(item => {

            return item.nome_categoria.toLowerCase() === categoria.toLowerCase()
        })
    })

    if (tipo === 'nao-alcoolicas') {
        renderizarNaoAlcoolicas(bebidasFiltradas)
    } else {
        renderizarAlcoolicas(bebidasFiltradas)
    }
}