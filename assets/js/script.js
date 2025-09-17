$(document).ready(function() {
    
    // URL da API.
    const API_URL = "http://localhost:5091"; 
    
    // Armazena a lista de notas
    let notasCache = [];

    // Variável para controlar a direção da ordenação
    let isAscending = true;

    // Função para renderizar a tabela com uma lista de notas
    function renderizarTabela(notas) {
        const $tabelaCorpo = $("#tabela-notas");
        $tabelaCorpo.empty();

        if (notas.length === 0) {
            $tabelaCorpo.append('<tr><td colspan="6" class="text-center">Nenhuma nota fiscal cadastrada</td></tr>');
            $("#totalNotas").text("0");
            $("#valorTotal").text("R$ 0,00");
        } else {
            let valorTotal = new Decimal(0);
            notas.forEach(function(nota) {
                valorTotal = valorTotal.plus(new Decimal(nota.valor));

                const dataCadastroFormatada = new Date(nota.dataHoraCadastro).toLocaleString();

                $tabelaCorpo.append(
                    `<tr>
                        <td>
                            <button class="btn btn-sm btn-danger btn-deletar" data-id="${nota.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                        <td>${nota.numeroDaNota}</td>
                        <td>${nota.nomeCliente}</td>
                        <td>R$ ${nota.valor.toFixed(2).replace('.', ',')}</td>
                        <td>${nota.dataEmissao}</td>
                        <td>${dataCadastroFormatada}</td>
                    </tr>`
                );
            });

            // Converta o objeto Decimal para string para exibição
            $("#totalNotas").text(notas.length);
            $("#valorTotal").text(`R$ ${valorTotal.toFixed(2).replace('.', ',')}`);
        }
    }

    // Função para carregar e listar as notas na tabela
    function listarNotas() {
        $.ajax({
            url: `${API_URL}/notas`,
            type: "GET",
            success: function(notas) {
                notasCache = notas; // Salva a lista de notas no cache
                renderizarTabela(notasCache); // Renderiza a tabela com os dados
            },
            error: function() {
                alert("Ocorreu um erro ao carregar as notas fiscais.");
            }
        });
    }

    // Chama a função para listar as notas quando a página carregar
    listarNotas();
    
    // Envio do formulario de cadastro
    $("#form-cadastro").submit(function(e) {
        e.preventDefault();

        const novaNota = {
            numeroDaNota: parseInt($("#numeroNota").val()),
            nomeCliente: $("#cliente").val(), 
            valor: parseFloat($("#valor").val()),
            dataEmissao: $("#dataEmissao").val()
        };

        $.ajax({
            url: `${API_URL}/notas`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(novaNota),
            success: function() {
                alert("Nota fiscal cadastrada com sucesso!");
                $("#form-cadastro")[0].reset();
                listarNotas();
            },
            error: function() {
                alert("Ocorreu um erro ao deletar a nota fiscal.");
            }
        });
    });

    // Funcionalidade de filtro
    $("#filtro").on("keyup", function() {
        const termoBusca = $(this).val();
        if (termoBusca === "") {
            listarNotas();
            return;
        }

        if (termoBusca.length >= 1) {
             $.ajax({
                 url: `${API_URL}/notas/buscar?nome=${termoBusca}`,
                 type: "GET",
                 success: function(notas) {
                     notasCache = notas;
                     renderizarTabela(notasCache);
                 }
              });
        }
    });

    // Funcionalidade de ordenação
    $("#btn-ordenar").on("click", function() {
        if (isAscending) {
            notasCache.sort((a, b) => a.valor - b.valor);
        } else {
            notasCache.sort((a, b) => b.valor - a.valor);
        }

        isAscending = !isAscending;

        renderizarTabela(notasCache); 
    });

    // Clique no botão de deletar
    $("#tabela-notas").on("click", ".btn-deletar", function() {
        const notaId = $(this).data("id");
        
        // Confirma se o usuário realmente quer deletar
        if (confirm("Tem certeza que deseja deletar esta nota fiscal?")) {
            $.ajax({
                url: `${API_URL}/NotasFiscais/${notaId}`, 
                type: "DELETE",
                success: function() {
                    alert("Nota fiscal deletada com sucesso!");
                    listarNotas();
                },
                error: function() {
                    alert("Ocorreu um erro ao deletar a nota fiscal.");
                }
            });
        }
    });
});