'use strict'

import { getBebidas } from "./bebidas.js"

const containerNaoAlcoolicas = document.getElementById('nao-alcoolicas')
const containerAlcoolicas = document.getElementById('alcoolicas')

function criarCard(bebida) {

    const marcas = bebida.marca.map(item => item.nome_marca).join(', ')

    const foto = bebida.foto_embalagem[0]

    const card = document.createElement('div')
    card.classList.add('card-bebida')

    card.innerHTML = `
        <div class="topo-card">
            <span class="volume-bebida">${bebida.litragem}</span>

            <img
                src="${foto.foto}"
                alt="${bebida.nome}"
            >
        </div>

        <div class="conteudo-bebida">
            <span class="marca-bebida">
                ${marcas}
            </span>

            <h3>${bebida.nome}</h3>

            <p>${bebida.descricao}</p>

            <span class="preco-bebida">
                R$ ${Number(foto.valor).toFixed(2).replace('.', ',')}
            </span>
        </div>
    `

    return card
}

function verificarSeAlcoolica(bebida) {

    return bebida.caracteristica.some(
        item => item.nome.toLowerCase() === 'com álcool'
    )
}

async function carregarBebidas() {

    try {

        if (!containerNaoAlcoolicas || !containerAlcoolicas) {
            console.error('Containers não encontrados.')
            return
        }

        const dados = await getBebidas('bebida')

        dados.response.bebida.forEach(bebida => {

            const card = criarCard(bebida)

            if (verificarSeAlcoolica(bebida)) {
                containerAlcoolicas.appendChild(card)
            } else {
                containerNaoAlcoolicas.appendChild(card)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

carregarBebidas()