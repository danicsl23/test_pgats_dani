const request = require('supertest');
const { expect } = require('chai')

describe('ListaUsuarios', () => {
    describe('GET /users', () => {
        it('Deve retornar 200 OK com lista de usuários contendo os campos esperados', async () => {
            //Teste 1: Verifica se a resposta contém uma lista de usuários em formato JSON com os campos corretos
            const resposta = await request('http://localhost:3000')
                .get('/users')

            // Verifica o status da resposta
            expect(resposta.status).to.equal(200);

            // Verifica se o corpo é um array
            expect(resposta.body).to.be.a('array');

            // Verifica se cada usuário tem os campos esperados e valida os tipos
            resposta.body.forEach(usuario => {
                expect(usuario).to.have.property('username');
                expect(usuario).to.have.property('favorecidos');
                expect(usuario).to.have.property('saldo');

                // Teste 2: Valida os tipos dos campos internos
                expect(usuario.username).to.be.a('string');
                expect(usuario.favorecidos).to.be.a('array');

                usuario.favorecidos.forEach(fav => {
                    expect(fav).to.be.a('string');
                });

                expect(usuario.saldo).to.be.a('number');
            });

            // Teste 3: Verifica se não há usuários duplicados (mesmo username)
            const usernames = resposta.body.map(u => u.username);
            const uniqueUsernames = new Set(usernames);
            expect(uniqueUsernames.size, `Foram encontrados usuários duplicados: ${usernames.filter((v,i,a)=> a.indexOf(v)!==i).join(', ')}`).to.equal(usernames.length);
        });
    });
});