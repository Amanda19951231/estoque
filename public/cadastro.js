document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalNovoMaterial');
    const form = document.getElementById('materialForm');
    const saveButton = document.getElementById('saveButton');
    const materialsTableBody = document.getElementById('materialsTableBody');
    const productsTableBody = document.getElementById('productsTableBody');

    // Fecha o modal
    window.closeModal = function (modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Abre o modal
    window.openModal = function (modalId) {
        document.getElementById(modalId).style.display = 'block';
    };

    // Função para preencher a tabela de materiais
    function populateMaterialsTable() {
        fetch('/materials')
            .then(response => response.json())
            .then(data => {
                materialsTableBody.innerHTML = '';
                // Filtra os itens para mostrar apenas os que são do tipo "material"
                const filteredData = data.filter(item => item.tipo === 'material');

                // Adiciona cada item filtrado à tabela
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>${item.descricao}</td>
                <td>${item.localizacao}</td>
            `;
                    materialsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Função para preencher a tabela de produtos
    function populateProductsTable() {
        fetch('/materials')
            .then(response => response.json())
            .then(data => {
                productsTableBody.innerHTML = '';
                // Filtra os itens para mostrar apenas os que são do tipo "produto"
                const filteredData = data.filter(item => item.tipo === 'produto');

                // Adiciona cada item filtrado à tabela
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>${item.descricao}</td>
                <td>${item.localizacao}</td>
            `;
                    productsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Carrega os materiais e produtos cadastrados quando a página for carregada
    populateMaterialsTable();
    populateProductsTable();

    // Salva o novo material
    saveButton.addEventListener('click', () => {
        const material = {
            tipo: form.tipo.value,
            nome: form.nome.value,
            descricao: form.descricao.value,
            localizacao: form.localizacao.value
        };

        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(material)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    closeModal('modalNovoMaterial');
                    populateMaterialsTable();
                    populateProductsTable();
                    form.reset();
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
