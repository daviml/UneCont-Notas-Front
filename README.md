# 🌐 Frontend de Gestão de Notas Fiscais

Interface de usuário web (Single-Page Application) para consumir a API de gestão de notas fiscais. O frontend permite o cadastro, listagem, busca, ordenação e deleção de notas fiscais, demonstrando as habilidades em HTML, CSS e JavaScript.

### 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura da página.
- **CSS3:** Estilização personalizada.
- **Bootstrap 5:** Framework para o layout responsivo e componentes UI.
- **JavaScript (ES6):** Lógica de interação com a página e chamadas AJAX.
- **jQuery:** Biblioteca para simplificar a manipulação do DOM e as requisições AJAX.
- **decimal.js:** Biblioteca para garantir a precisão em cálculos com valores monetários.

### ✨ Funcionalidades

- **Cadastro de Notas:** Formulário para adicionar novas notas fiscais à API.
- **Listagem Dinâmica:** Tabela que é atualizada em tempo real após o cadastro ou filtros, sem recarregar a página.
- **Busca:** Campo de busca por nome do cliente.
- **Ordenação:** Botão para ordenar a lista de notas por valor (crescente e decrescente).
- **Deleção:** Botão de lixeira na tabela para deletar uma nota fiscal específica.
- **Estatísticas:** Exibição do número total de notas e o valor total em tempo real.

### ▶️ Como Rodar o Frontend

1.  Certifique-se de que o backend da API está rodando (em `http://localhost:5091`).
2.  Abra o arquivo `index.html` em seu navegador de preferência.

A aplicação irá se conectar automaticamente à API e carregar os dados.