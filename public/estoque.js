// Função para obter dados de compras
function fetchPurchases() {
    return fetch("/purchases")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching purchases:", error);
        return []; // Retorna um array vazio em caso de erro
      });
}

// Função para obter dados de retiradas
function fetchRetiradas() {
    return fetch("/retiradas")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching retiradas:", error);
        return []; // Retorna um array vazio em caso de erro
      });
}

// Função para preencher a tabela de estoque e a tabela "em falta"
function populateEstoqueTables() {
    Promise.all([fetchPurchases(), fetchRetiradas()])
      .then(([purchases, retiradas]) => {
        return fetch("/materials")
          .then((response) => response.json())
          .then((materials) => {
            const productMap = new Map();

            // Inicializa o mapa com dados de materiais
            materials.forEach((item) => {
              productMap.set(item.nome, {
                nome: item.nome,
                tipo: item.tipo,
                descricao: item.descricao,
                localizacao: item.localizacao,
                quantidadeTotal: item.quantidadeTotal || 0, // Usa a quantidade total inicial se disponível
                quantidadeEmUso: 0, // Inicializa a quantidade em uso
                quantidadeTotalCompras: 0 // Inicializa a quantidade total de compras
              });
            });

            // Atualiza a quantidade total de compras com base nas compras
            purchases.forEach((purchase) => {
              const quantidade = parseInt(purchase.quantidade, 10); // Converte a quantidade para número
              if (!isNaN(quantidade)) {
                if (productMap.has(purchase.nome)) {
                  const product = productMap.get(purchase.nome);
                  product.quantidadeTotalCompras += quantidade;
                } else {
                  // Adiciona um novo produto se não existir no mapa
                  productMap.set(purchase.nome, {
                    nome: purchase.nome,
                    tipo: purchase.tipo,
                    descricao: purchase.descricao,
                    localizacao: purchase.localizacao,
                    quantidadeTotal: quantidade,
                    quantidadeEmUso: 0,
                    quantidadeTotalCompras: quantidade
                  });
                }
              }
            });

            // Atualiza a quantidade total com base nas retiradas
            retiradas.forEach((retirada) => {
              const quantidade = parseInt(retirada.quantidade, 10); // Converte a quantidade para número
              if (!isNaN(quantidade)) {
                if (productMap.has(retirada.nome)) {
                  const product = productMap.get(retirada.nome);
                  product.quantidadeTotal -= quantidade;
                } else {
                  // Se retiradas para um produto que não existe no mapa, inicializa com quantidade negativa
                  productMap.set(retirada.nome, {
                    nome: retirada.nome,
                    tipo: retirada.tipo,
                    descricao: retirada.descricao,
                    localizacao: retirada.localizacao,
                    quantidadeTotal: -quantidade,
                    quantidadeEmUso: -quantidade,
                    quantidadeTotalCompras: 0 // Inicializa a quantidade total de compras
                  });
                }
              }
            });

            // Preenche a tabela de estoque
            const productsTableBody = document.querySelector(".order-table tbody");
            productsTableBody.innerHTML = "";

            // Preenche a tabela de "em falta"
            const faltaTableBody = document.querySelector("#faltaTableBody");
            faltaTableBody.innerHTML = "";

            productMap.forEach((product) => {
              // Adiciona linha à tabela de estoque
              const row = document.createElement("tr");
              row.innerHTML = 
                `<td>${product.nome}</td>
                 <td>${product.tipo}</td>
                 <td>${product.tipo === 'material' ? product.quantidadeTotalCompras + product.quantidadeTotal : '--'}</td>
                 <td>${product.tipo === 'produto' ? product.quantidadeTotalCompras + product.quantidadeTotal : product.quantidadeTotalCompras}</td>`;
              productsTableBody.appendChild(row);

              // Verifica se o produto está em falta e adiciona à tabela "em falta"
              const quantidadeTotalAtual = product.tipo === 'produto' ? product.quantidadeTotalCompras + product.quantidadeTotal : product.quantidadeTotalCompras;
              if (quantidadeTotalAtual < 10) {
                const faltaRow = document.createElement("tr");
                faltaRow.innerHTML = 
                  `<td>${product.nome}</td>
                   <td>${product.tipo}</td>`;
                faltaTableBody.appendChild(faltaRow);
              }
            });
          });
      })
      .catch((error) => console.error("Error:", error));
}

populateEstoqueTables();
