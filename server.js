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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
