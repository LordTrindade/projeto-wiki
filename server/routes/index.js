const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');


const { getJsonPageList } = require('../scripts/json_file_manipulation');
const { getJsonPageByTitle } = require('../scripts/json_file_manipulation');
const { saveJsonToFile } = require('../scripts/json_file_manipulation');
const { deleteJsonFile } = require('../scripts/json_file_manipulation');
const { normalizeTitle } = require('../scripts/utils');
const { jsonPageExists } = require('../scripts/json_file_manipulation');

const { saveHtmlFile } = require('../scripts/html_file_manipulation');
const { getHtmlFile } = require('../scripts/html_file_manipulation');
const { getEditionTemplateFile } = require('../scripts/html_file_manipulation');
const { deleteHtmlFile } = require('../scripts/html_file_manipulation');

const imageHandler = require('../scripts/media_file_manipulation');


// Rota para servir a página inicial
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../../views/home.html');
    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            console.error('Arquivo não encontrado:', filePath);
            return res.status(404).send('Página não encontrada');
        }
        res.sendFile(filePath);
    });
});

// Rota para servir a página inicial em /home
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/home.html'));
});

// Nova rota para manipular dados JSON
router.get('/get-page-list-json', async (req, res) => {
    //console.log('Request received');
    try {
        const dataList = await getJsonPageList();
        console.log('Data list:', dataList);
        res.json(dataList);
    } catch (error) {
        console.error('Failed to retrieve JSON page list:', error);
        res.status(500).send('Internal Server Error');
    }
});

///////////////////////
////////POST
///////////////////////

router.post('/save-page-json', async (req, res) => {
    
    if (!req.body || Object.keys(req.body).length === 0) {
        // Se req.body for undefined ou vazio, retorna um erro 400 (Bad Request)
        return res.status(400).send('No data provided.');
    }

    const data = req.body;
    //console.log('data is', data)
    const title = normalizeTitle(data.pageTitle);

    const directoryPath = path.join(__dirname, '../../data/json');
    const filePath = path.join(directoryPath, title+'.json');

    try {
        // Verificar se o arquivo já existe
        if (fs.existsSync(filePath)) {
            //return res.status(409).send('Um arquivo com o mesmo título já existe.');
            ;
        }

        // Chamar a função saveJsonToFile para salvar o arquivo
        const saved = await saveJsonToFile(filePath, data);
        if (saved) {
            res.send('JSON salvo com sucesso.');
        } else {
            res.status(500).send('Erro ao salvar o arquivo JSON.');
        }
    } catch (error) {
        console.error('Erro ao processar o pedido:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

router.post('/save-page-html', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('No data provided.');
    }
    
    const data = req.body;
    const htmlContent = data.htmlContent;
    const title = normalizeTitle(data.pageTitle);

    const filePath = path.join(__dirname, 'html_page', `${title}.html`);

    try {
        if (fs.existsSync(filePath)) {
            //return res.status(409).send('Um arquivo com o mesmo título já existe.');
            ;
        }

        const saved = await saveHtmlFile(title, htmlContent);
        if (saved) {
            res.send('Página HTML salva com sucesso.');
        } else {
            res.status(500).send('Erro ao salvar a página HTML.');
        }
    } catch (error) {
        console.error('Erro ao processar o pedido:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

///////////////////////
////////GET
///////////////////////


router.get('/get-html/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const htmlContent = await getHtmlFile(title);
        res.send(htmlContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(404).send(error);
    }
});

router.get('/get-json/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const jsonData = await getJsonPageByTitle(title);
        //console.log(`json data is: ${jsonData}`);
        if (Object.keys(jsonData).length !== 0) {
            res.json(jsonData);
        } else {
            res.status(404).send('No JSON file found with the given title.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/get-template-edition', async (req, res) => {

    try {
        const htmlContent = await getEditionTemplateFile();
        res.send(htmlContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(404).send(error);
    }
});



///////////////////////
////////PUT
///////////////////////




router.put('/update-page-json', async (req, res) => {
    if (!req.body || !req.body.oldTitle || !req.body.newData) {
        // Verifica se os dados necessários estão presentes
        return res.status(400).send('Incomplete data provided.');
    }

    const oldTitle = normalizeTitle(req.body.oldTitle);
    const newData = req.body.newData;
    const newTitle = normalizeTitle(newData.pageTitle);

    const directoryPath = path.join(__dirname, '../../data/json');
    const oldFilePath = path.join(directoryPath, `${oldTitle}.json`);
    const newFilePath = path.join(directoryPath, `${newTitle}.json`);

    try {
        // Deletar o arquivo antigo
        const deleteSuccess = await deleteJsonFile(oldFilePath);
        if (!deleteSuccess) {
            return res.status(500).send('Failed to delete the old JSON file.');
            ;
        }

        // Salvar o novo arquivo
        const saveSuccess = await saveJsonToFile(newFilePath, newData);
        if (saveSuccess) {
            res.send('JSON updated and saved successfully.');
        } else {
            res.status(500).send('Failed to save the updated JSON.');
        }
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).send('Internal Server Error.');
    }
});


router.put('/update-page-html', async (req, res) => {
    if (!req.body || !req.body.oldTitle || !req.body.newData) {
        // Verifica se os dados necessários estão presentes
        return res.status(400).send('Incomplete data provided.');
    }

    const oldTitle = normalizeTitle(req.body.oldTitle);
    const newData = req.body.newData;
    const newTitle = normalizeTitle(newData.pageTitle);

    const directoryPath = path.join(__dirname, '../../public/html_page');
    const oldFilePath = path.join(directoryPath, `${oldTitle}.html`);
    const newFilePath = path.join(directoryPath, `${newTitle}.html`);

    try {
        // Deletar o arquivo antigo
        const deleteSuccess = await deleteHtmlFile(oldFilePath);
        if (!deleteSuccess) {
            return res.status(500).send('Failed to delete the old HTML file.');
        }

        // Salvar o novo arquivo
        const saveSuccess = await saveHtmlFile(newFilePath, newData);
        if (saveSuccess) {
            res.send('HTML page saved successfully.');
        } else {
            res.status(500).send('Failed to save the updated HTML.');
        }
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).send('Internal Server Error.');
    }
});



///////////////////////
////////ROTAS DE MANIPULACAO DE IMAGEM
///////////////////////

// Rota para upload de imagem
router.post('/upload-image', (req, res) => {
    imageHandler.saveImage(req, res, () => {
        // Use req.imagePath que foi definido em saveImage
        if (req.imagePath) {
            res.json({ success: true, message: 'Imagem salva com sucesso!', imagePath: req.imagePath });
        } else {
            res.status(500).json({ success: false, message: "Não foi possível obter o caminho da imagem." });
        }
    });
});

// Rota para recuperar uma imagem pelo título
router.get('/image/:title', (req, res) => {
    const filePath = imageHandler.getImageByTitle(req.params.title);
    res.sendFile(filePath);
});

// Rota para listar todas as imagens
router.get('/images-list', (req, res) => {
    imageHandler.listImages((err, files) => {
        if (err) {
            res.status(500).send('Erro ao listar imagens');
        } else {
            res.json(files);
        }
    });
});


////////////////////////////////
module.exports = router;
