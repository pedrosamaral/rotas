# Sistema de Rotas

Sistema básico de gestão de rotas para motoristas, ajudantes e carros. Acesso exclusivo do gestor.

## Como usar

1. Abra o arquivo `index.html` no navegador (duplo clique ou arraste para o Chrome/Edge/Firefox)
2. Faça login com a senha padrão: **gestor123**
3. Cadastre motoristas, ajudantes e carros antes de criar rotas

## Funcionalidades

- **Motoristas** — cadastro com nome, telefone e CNH
- **Ajudantes** — cadastro com nome e telefone (opcional nas rotas)
- **Carros** — placa, modelo, tamanho (Pequeno / Médio / Grande) e motorista vinculado
- **Rotas** — origem, parada (opcional), destino, tipo (Entrega / Coleta), observação e status
- **Status** — Pendente, Em andamento, Concluído, Finalizado, Cancelado
- **Agenda** — calendário mensal com múltiplas rotas por dia
- **Compartilhar** — copia texto formatado da rota ou do dia inteiro

## Dados

Os dados ficam salvos no navegador (localStorage). Não são perdidos ao fechar a aba, mas são específicos do navegador/computador usado.

## Alterar senha do gestor

No console do navegador (F12), execute:

```javascript
const d = JSON.parse(localStorage.getItem('sistema_rotas_data'));
d.senhaGestor = 'sua_nova_senha';
localStorage.setItem('sistema_rotas_data', JSON.stringify(d));
```
