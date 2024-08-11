const fs = require('fs');

// Carregar o arquivo JSON original
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    try {
        const originalData = JSON.parse(data);
        const categories = [];
        const items = [];
        let categoryId = 0;

        originalData.forEach(item => {
            const title = item.title;
            const dataItems = item.data;

            // Adicionar a categoria à lista de categorias
            categories.push({
                id: categoryId,
                title: title
            });

            dataItems.forEach(dataItem => {
                // Adicionar o item à lista de items com referência à categoria
                dataItem.category_id = categoryId;
                items.push(dataItem);
            });

            categoryId++;
        });

        // Verificar e criar as pastas, se não existirem
        const categoriesDir = './categories';
        const itemsDir = './items';

        if (!fs.existsSync(categoriesDir)) {
            fs.mkdirSync(categoriesDir);
        }

        if (!fs.existsSync(itemsDir)) {
            fs.mkdirSync(itemsDir);
        }

        // Salvar as categorias em um arquivo separado
        fs.writeFile(`${categoriesDir}/categories.json`, JSON.stringify(categories, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao salvar as categorias:', err);
                return;
            }
            console.log('Arquivo categories.json criado com sucesso!');
        });

        // Salvar os itens em um arquivo separado
        fs.writeFile(`${itemsDir}/items.json`, JSON.stringify(items, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao salvar os itens:', err);
                return;
            }
            console.log('Arquivo items.json criado com sucesso!');
        });
    } catch (parseErr) {
        console.error('Erro ao processar o JSON:', parseErr);
    }
});
