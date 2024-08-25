document.addEventListener('DOMContentLoaded', function () {
    const modalRetirada = document.getElementById('modalRetiradaMaterial');
    const formRetirada = modalRetirada.querySelector('form');
    const selectTipoRetirada = formRetirada.querySelector('#tipo');
    const selectNomeRetirada = formRetirada.querySelector('#nome');
    const inputQtdeRetirada = formRetirada.querySelector('#qtde');
    const saveButtonRetirada = modalRetirada.querySelector('#saveRetiradaButton');

    // Função para abrir o modal e carregar os itens
    function openRetiradaModal() {
        const tipo = selectTipoRetirada.value;

        // Limpar o select de nomes
        selectNomeRetirada.innerHTML = '<option value="">Selecione o item</option>';

        // Carregar os itens disponíveis
        fetch('/materials')
            .then(response => response.json())
            .then(data => {
                const items = data.filter(item => item.tipo === tipo);

                items.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.nome;
                    option.textContent = item.nome;
                    selectNomeRetirada.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));

        openModal('modalRetiradaMaterial');
    }

    // Adicionar evento de clique para abrir o modal
    document.getElementById('btnRetiradaMaterial').onclick = openRetiradaModal;

    // Salvar a retirada
    saveButtonRetirada.addEventListener('click', () => {
        const tipo = selectTipoRetirada.value;
        const nome = selectNomeRetirada.value;
        const quantidade = parseInt(inputQtdeRetirada.value, 10);

        if (!nome || isNaN(quantidade) || quantidade <= 0) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        const retirada = {
            tipo,
            nome,
            quantidade,
            data: new Date().toISOString()
        };

        fetch('/retiradas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(retirada)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                closeModal('modalRetiradaMaterial');
                updateEstoqueTable();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Função para atualizar a tabela de estoque
    function updateEstoqueTable() {
        fetch('/materials')
            .then(response => response.json())
            .then(materials => {
                fetch('/retiradas')
                    .then(response => response.json())
                    .then(retiradas => {
                        const estoque = {};

                        // Inicializar o estoque
                        materials.forEach(item => {
                            if (!estoque[item.nome]) {
                                estoque[item.nome] = {
                                    nome: item.nome,
                                    tipo: item.tipo,
                                    quantidadeEmUso: 0,
                                    quantidadeTotal: item.quantidadeTotal || 0
                                };
                            }
                        });

                        // Somar as quantidades retiradas
                        retiradas.forEach(retirada => {
                            if (estoque[retirada.nome]) {
                                estoque[retirada.nome].quantidadeEmUso += retirada.quantidade;
                            }
                        });

                        // Atualizar a tabela
                        const tbody = document.querySelector('.order-table tbody');
                        tbody.innerHTML = '';
                        Object.values(estoque).forEach(item => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${item.nome}</td>
                                <td>${item.tipo}</td>
                                <td>${item.quantidadeEmUso}</td>
                                <td>${item.quantidadeTotal - item.quantidadeEmUso}</td>
                            `;
                            tbody.appendChild(row);
                        });
                    });
            });
    }
});
