'use strict'

import { getBebidas } from './bebidas.js'

const containerNaoAlcoolicas = document.getElementById('nao-alcoolicas')
const containerAlcoolicas = document.getElementById('alcoolicas')

let todasBebidas = []
let bebidasAlcoolicas = []
let bebidasNaoAlcoolicas = []
let quantidadeAtual = 0

// Estado dos filtros
let filtrosAtivos = {
    'nao-alcoolicas': {
        categoria: 'todos',
        marca: 'todos',
        sabor: 'todos',
        caracteristica: 'todos'
    },
    'alcoolica': {
        categoria: 'todos',
        marca: 'todos',
        sabor: 'todos',
        caracteristica: 'todos'
    }
}

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

function extrairValoresUnicos(bebidas, chave, nomeChave) {
    const valores = new Set()
    
    bebidas.forEach(bebida => {
        if (bebida[chave] && Array.isArray(bebida[chave])) {
            bebida[chave].forEach(item => {
                valores.add(item[nomeChave])
            })
        }
    })
    
    return Array.from(valores).sort()
}

function criarFiltrosGenéricos(tipo) {
    const listaBase = tipo === 'nao-alcoolicas' ? bebidasNaoAlcoolicas : bebidasAlcoolicas
    
    if (listaBase.length === 0) return

    // Extrair valores únicos
    const categorias = extrairValoresUnicos(listaBase, 'categoria', 'nome_categoria')
    const marcas = extrairValoresUnicos(listaBase, 'marca', 'nome_marca')
    const sabores = extrairValoresUnicos(listaBase, 'sabor', 'nome_sabor')
    const caracteristicas = extrairValoresUnicos(listaBase, 'caracteristica', 'nome')

    // Procurar containers de filtros
    const containerFiltros = document.querySelector(`.filtros-${tipo}`)
    
    if (!containerFiltros) {
        console.warn(`Container de filtros para ${tipo} não encontrado`)
        return
    }

    limparContainer(containerFiltros)

    // Criar seção de categorias
    if (categorias.length > 0) {
        const secaoCategoria = document.createElement('div')
        secaoCategoria.classList.add('filtro-secao')
        
        const titulo = document.createElement('h4')
        titulo.textContent = 'Categoria'
        secaoCategoria.appendChild(titulo)

        const todosBtn = document.createElement('button')
        todosBtn.classList.add('filtro-opcao', 'ativo')
        todosBtn.textContent = 'Todos'
        todosBtn.dataset.tipo = 'categoria'
        todosBtn.dataset.valor = 'todos'
        secaoCategoria.appendChild(todosBtn)

        categorias.forEach(categoria => {
            const btn = document.createElement('button')
            btn.classList.add('filtro-opcao')
            btn.textContent = categoria
            btn.dataset.tipo = 'categoria'
            btn.dataset.valor = categoria
            secaoCategoria.appendChild(btn)
        })

        containerFiltros.appendChild(secaoCategoria)
    }

    // Criar seção de marcas
    if (marcas.length > 0) {
        const secaoMarca = document.createElement('div')
        secaoMarca.classList.add('filtro-secao')
        
        const titulo = document.createElement('h4')
        titulo.textContent = 'Marca'
        secaoMarca.appendChild(titulo)

        const todosBtn = document.createElement('button')
        todosBtn.classList.add('filtro-opcao', 'ativo')
        todosBtn.textContent = 'Todos'
        todosBtn.dataset.tipo = 'marca'
        todosBtn.dataset.valor = 'todos'
        secaoMarca.appendChild(todosBtn)

        marcas.forEach(marca => {
            const btn = document.createElement('button')
            btn.classList.add('filtro-opcao')
            btn.textContent = marca
            btn.dataset.tipo = 'marca'
            btn.dataset.valor = marca
            secaoMarca.appendChild(btn)
        })

        containerFiltros.appendChild(secaoMarca)
    }

    // Criar seção de sabores
    if (sabores.length > 0) {
        const secaoSabor = document.createElement('div')
        secaoSabor.classList.add('filtro-secao')
        
        const titulo = document.createElement('h4')
        titulo.textContent = 'Sabor'
        secaoSabor.appendChild(titulo)

        const todosBtn = document.createElement('button')
        todosBtn.classList.add('filtro-opcao', 'ativo')
        todosBtn.textContent = 'Todos'
        todosBtn.dataset.tipo = 'sabor'
        todosBtn.dataset.valor = 'todos'
        secaoSabor.appendChild(todosBtn)

        sabores.forEach(sabor => {
            const btn = document.createElement('button')
            btn.classList.add('filtro-opcao')
            btn.textContent = sabor
            btn.dataset.tipo = 'sabor'
            btn.dataset.valor = sabor
            secaoSabor.appendChild(btn)
        })

        containerFiltros.appendChild(secaoSabor)
    }

    // Criar seção de características
    if (caracteristicas.length > 0) {
        const secaoCaracteristica = document.createElement('div')
        secaoCaracteristica.classList.add('filtro-secao')
        
        const titulo = document.createElement('h4')
        titulo.textContent = 'Características'
        secaoCaracteristica.appendChild(titulo)

        const todosBtn = document.createElement('button')
        todosBtn.classList.add('filtro-opcao', 'ativo')
        todosBtn.textContent = 'Todos'
        todosBtn.dataset.tipo = 'caracteristica'
        todosBtn.dataset.valor = 'todos'
        secaoCaracteristica.appendChild(todosBtn)

        caracteristicas.forEach(caracteristica => {
            const btn = document.createElement('button')
            btn.classList.add('filtro-opcao')
            btn.textContent = caracteristica
            btn.dataset.tipo = 'caracteristica'
            btn.dataset.valor = caracteristica
            secaoCaracteristica.appendChild(btn)
        })

        containerFiltros.appendChild(secaoCaracteristica)
    }
}

function aplicarFiltrosGenéricos(tipo) {
    const listaBase = tipo === 'nao-alcoolicas' ? bebidasNaoAlcoolicas : bebidasAlcoolicas
    const filtros = filtrosAtivos[tipo]

    let resultado = listaBase.filter(bebida => {
        // Filtro de categoria
        if (filtros.categoria !== 'todos') {
            const temCategoria = bebida.categoria.some(
                item => item.nome_categoria === filtros.categoria
            )
            if (!temCategoria) return false
        }

        // Filtro de marca
        if (filtros.marca !== 'todos') {
            const temMarca = bebida.marca.some(
                item => item.nome_marca === filtros.marca
            )
            if (!temMarca) return false
        }

        // Filtro de sabor
        if (filtros.sabor !== 'todos') {
            const temSabor = bebida.sabor.some(
                item => item.nome_sabor === filtros.sabor
            )
            if (!temSabor) return false
        }

        // Filtro de característica
        if (filtros.caracteristica !== 'todos') {
            const temCaracteristica = bebida.caracteristica.some(
                item => item.nome === filtros.caracteristica
            )
            if (!temCaracteristica) return false
        }

        return true
    })

    if (tipo === 'nao-alcoolicas') {
        renderizarNaoAlcoolicas(resultado)
    } else {
        renderizarAlcoolicas(resultado)
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
        criarFiltrosGenéricos('nao-alcoolicas')
        criarFiltrosGenéricos('alcoolica')
    } catch (error) {
        console.error('Erro ao atualizar bebidas:', error)
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
        console.error('Erro ao verificar novas bebidas:', error)
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
        configurarFiltrosGenéricos()

        document.querySelectorAll('[data-categoria="todos"]').forEach(botao => botao.classList.add('ativo'))

        setInterval(verificarNovasBebidas, 3000)

    } catch (error) {
        console.error('Erro ao iniciar:', error)
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

function configurarFiltrosGenéricos() {
    document.addEventListener('click', (event) => {
        const botao = event.target.closest('.filtro-opcao')
        
        if (!botao) return

        const tipo = botao.dataset.tipo
        const valor = botao.dataset.valor
        const secao = botao.closest('.filtro-secao')
        const container = secao.closest('[class*="filtros-"]')
        
        // Determinar o tipo de bebida (nao-alcoolicas ou alcoolica)
        let tipoBebidasKey = 'nao-alcoolicas'
        if (container.classList.contains('filtros-alcoolica')) {
            tipoBebidasKey = 'alcoolica'
        }

        // Remover classe ativa de outros botões da mesma seção
        secao.querySelectorAll('.filtro-opcao').forEach(btn => {
            btn.classList.remove('ativo')
        })

        // Adicionar classe ativa ao botão clicado
        botao.classList.add('ativo')

        // Atualizar filtros ativos
        filtrosAtivos[tipoBebidasKey][tipo] = valor

        // Aplicar filtros
        aplicarFiltrosGenéricos(tipoBebidasKey)
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
