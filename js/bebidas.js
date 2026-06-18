'use strict'

const url = 'http://localhost:8081/v1/delicia-gelada'

export async function getBebidas(endpoint) {
    const response = await fetch(`${url}/${endpoint}`)

    if (!response.ok) {
        throw new Error('Erro ao listar bebidas')
    }

    return await response.json()
}