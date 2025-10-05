const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('ListaUsuarios', () => {
    describe('GET /users', () => {
       
        //Teste 1: Verifica se a resposta contém uma lista de usuários em formato JSON com os campos corretos
        it('Deve retornar 200 OK com lista de usuários contendo os campos esperados', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/users')
             expect(resposta.status).to.equal(200);
        });

        it('Lista de usuários em JSON com username, favorecidos e saldo (tipagem)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/users');
            
            const usuarios = Array.isArray(resposta.body) ? resposta.body : JSON.parse(resposta.text);
                      
            // Verifica se o corpo é um array
            expect(usuarios).to.be.a('array');
           
            // Teste 2: Verifica se cada usuário tem os campos esperados e valida os tipos
            usuarios.forEach(u => {
                expect(u).to.have.property('username').that.is.a('string');
                expect(u).to.have.property('favorecidos').that.is.an('array');
                expect(u).to.have.property('saldo').that.is.a('number');
            
            });
        });
        
        // Teste 3: Verifica se não há usuários duplicados (mesmo username)
       it('Não deve haver usuários duplicados', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/users');

            const usuarios = Array.isArray(resposta.body) ? resposta.body : [];

            // Extrai os usernames e normaliza (sem espaços e tudo minúsculo)
            const usernames = usuarios.map(u => u.username?.trim().toLowerCase());

            // Cria um conjunto com os usernames únicos
            const usernamesUnicos = new Set(usernames);

            // Compara: se o tamanho do conjunto for igual à lista, não há duplicados
            expect(usernamesUnicos.size).to.equal(usernames.length);
        });
    });
});