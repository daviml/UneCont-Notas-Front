$(document).ready(function() {
    
    // URL da sua API. Verifique a porta do seu backend!
    const API_URL = "http://localhost:5091"; 
    
    // Armazena a lista de notas para poder ordenar ou filtrar sem fazer nova requisição
    let notasCache = [];

    // Variável para controlar a direção da ordenação (true = crescente, false = decrescente)
    let isAscending = true;

    // Função para renderizar a tabela com uma lista de notas
    function renderizarTabela(notas) {
        const $tabelaCorpo = $("#tabela-notas");
        $tabelaCorpo.empty();

        if (notas.length === 0) {
            $tabelaCorpo.append('<tr><td colspan="5" class="text-center">Nenhuma nota fiscal cadastrada</td></tr>');
            $("#totalNotas").text("0");
            $("#valorTotal").text("R$ 0,00");
        } else {
            let valorTotal = new Decimal(0);
            notas.forEach(function(nota) {
                valorTotal = valorTotal.plus(new Decimal(nota.valor));

                const dataCadastroFormatada = new Date(nota.dataHoraCadastro).toLocaleString();

                $tabelaCorpo.append(
                    `<tr>
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
    
    // Lida com o envio do formulário de cadastro
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
            error: function(jqXHR) {
                const erro = jqXHR.responseJSON;
                let mensagemErro = "Ocorreu um erro ao cadastrar a nota fiscal.";
                if (erro && erro.errors) {
                    mensagemErro = "Erros de validação:\n";
                    for (const key in erro.errors) {
                        mensagemErro += `- ${erro.errors[key].join(', ')}\n`;
                    }
                }
                alert(mensagemErro);
            }
        });
    });

    // Lida com a funcionalidade de filtro
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

    // Lida com a funcionalidade de ordenação
    $("#btn-ordenar").on("click", function() {
        if (isAscending) {
            // Ordena a lista em cache em ordem crescente
            notasCache.sort((a, b) => a.valor - b.valor);
        } else {
            // Ordena a lista em cache em ordem decrescente
            notasCache.sort((a, b) => b.valor - a.valor);
        }

        // Inverte a direção da ordenação para o próximo clique
        isAscending = !isAscending;

        // Renderiza a tabela com a lista ordenada
        renderizarTabela(notasCache); 
    });
});