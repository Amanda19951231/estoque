const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.static('public'));

// Rota para obter os materiais
app.get('/materials', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'materials.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }

        try {
            const materials = JSON.parse(data || '[]');
            res.status(200).json(materials);
        } catch (parseError) {
            console.error('Erro ao processar os dados JSON:', parseError);
            res.status(500).json({ error: 'Erro ao processar os dados' });
        }
    });
});

// Rota para salvar os dados
app.post('/save', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'public', 'materials.json');

    // Ler o arquivo JSON existente e adicionar o novo dado
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ message: 'Erro ao ler o arquivo.' });
        }

        let materials = [];
        if (fileData) {
            try {
                materials = JSON.parse(fileData);
            } catch (parseError) {
                console.error('Erro ao processar os dados JSON:', parseError);
                return res.status(500).json({ message: 'Erro ao processar os dados existentes.' });
            }
        }

        materials.push(data);

        // Escrever os dados atualizados no arquivo JSON
        fs.writeFile(filePath, JSON.stringify(materials, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar os dados:', err);
                return res.status(500).json({ message: 'Erro ao salvar os dados.' });
            }

            res.status(200).json({ message: 'Material salvo com sucesso!' });
        });
    });
});

// Rota para salvar as compras
app.post('/savePurchase', (req, res) => {
    const purchase = req.body;
    const filePath = path.join(__dirname, 'public', 'purchases.json');

    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Erro ao ler o arquivo de compras:', err);
            return res.status(500).json({ message: 'Erro ao ler o arquivo.' });
        }

        let purchases = [];
        if (fileData) {
            purchases = JSON.parse(fileData);
        }

        purchases.push(purchase);

        fs.writeFile(filePath, JSON.stringify(purchases, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar os dados de compras:', err);
                return res.status(500).json({ message: 'Erro ao salvar os dados.' });
            }

            res.status(200).json({ message: 'Compra salva com sucesso!' });
        });
    });
});

// Rota para salvar as retiradas
app.post('/retiradas', (req, res) => {
    const retirada = req.body;
    const filePathRetiradas = path.join(__dirname, 'retiradas.json');

    fs.readFile(filePathRetiradas, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Erro ao ler o arquivo de retiradas:', err);
            return res.status(500).json({ message: 'Erro ao ler o arquivo de retiradas.' });
        }

        let retiradas = [];
        if (fileData) {
            retiradas = JSON.parse(fileData);
        }

        retiradas.push(retirada);

        fs.writeFile(filePathRetiradas, JSON.stringify(retiradas, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar a retirada:', err);
                return res.status(500).json({ message: 'Erro ao salvar a retirada.' });
            }

            // Atualizar o arquivo de materiais
            const filePathMaterials = path.join(__dirname, 'public', 'materials.json');

            fs.readFile(filePathMaterials, 'utf8', (err, materialsData) => {
                if (err) {
                    console.error('Erro ao ler o arquivo de materiais:', err);
                    return res.status(500).json({ message: 'Erro ao ler o arquivo de materiais.' });
                }

                let materials = [];
                try {
                    materials = JSON.parse(materialsData);
                } catch (parseError) {
                    console.error('Erro ao processar os dados JSON dos materiais:', parseError);
                    return res.status(500).json({ message: 'Erro ao processar os dados dos materiais.' });
                }

                materials = materials.map(item => {
                    if (item.nome === retirada.nome && item.tipo === retirada.tipo) {
                        item.quantidadeTotal -= retirada.quantidade;
                    }
                    return item;
                });

                fs.writeFile(filePathMaterials, JSON.stringify(materials, null, 2), (err) => {
                    if (err) {
                        console.error('Erro ao atualizar a quantidade de materiais:', err);
                        return res.status(500).json({ message: 'Erro ao atualizar a quantidade de materiais.' });
                    }

                    res.status(200).json({ message: 'Retirada registrada com sucesso!' });
                });
            });
        });
    });
});

// Rota para obter as retiradas
app.get('/retiradas', (req, res) => {
    const filePathRetiradas = path.join(__dirname, 'retiradas.json');

    fs.readFile(filePathRetiradas, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de retiradas:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo de retiradas' });
        }
        try {
            const retiradas = JSON.parse(data || '[]');
            res.status(200).json(retiradas);
        } catch (parseError) {
            console.error('Erro ao processar os dados JSON das retiradas:', parseError);
            res.status(500).json({ error: 'Erro ao processar os dados das retiradas' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
