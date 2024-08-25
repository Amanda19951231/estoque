document.addEventListener('DOMContentLoaded', function () {
    const modalNovaCompra = document.getElementById('modalNovaCompra');
    const tipoNovaCompra = document.getElementById('tipoNovaCompra');
    const nomeNovaCompra = document.getElementById('nomeNovaCompra');
    const saveNovaCompraButton = document.getElementById('saveNovaCompraButton');
    const novaCompraForm = document.getElementById('novaCompraForm');
    const estoqueTableBody = document.querySelector('table.order-table tbody');

    // Função para atualizar o campo "Nome" no modal com base na seleção de "Produto/Material"
    tipoNovaCompra.addEventListener('change', function () {
        const tipoSelecionado = tipoNovaCompra.value;
        nomeNovaCompra.innerHTML = '<option value=""></option>'; // Limpa as opções existentes

        fetch('/materials')
            .then(response => response.json())
            .then(data => {
                const filteredItems = data.filter(item => item.tipo === tipoSelecionado);
                filteredItems.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.nome;
                    option.textContent = item.nome;
                    nomeNovaCompra.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    });

    // Salva a nova compra
    saveNovaCompraButton.addEventListener('click', () => {
        const novaCompra = {
            tipo: novaCompraForm.tipo.value,
            nome: novaCompraForm.nome.value,
            quantidade: novaCompraForm.qtde.value
        };

        fetch('/savePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaCompra)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    closeModal('modalNovaCompra');
                    populateEstoqueTable(); // Atualiza a tabela de estoque
                    novaCompraForm.reset();
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
