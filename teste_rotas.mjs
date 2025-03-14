import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// Convertendo import.meta.url para caminho de arquivo
const __filename = fileURLToPath(import.meta.url);

// Obtendo o diretório do arquivo atual
const __dirname = path.dirname(__filename);

async function testSavePageJson() {
    const data = {
        pageTitle: 'Test Page',
        htmlContent: '<html><body>Hello, World!</body></html>'
    };

    try {
        const response = await fetch('http://localhost:3000/save-page-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Resposta:', await response.text());
        } else {
            console.log('Falha ao salvar JSON:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

//testSavePageJson();

async function saveHtmlPage() {
    const pageTitle = "ExamplePage";  // Título inventado
    const htmlContent = "<html><head><title>Example Page</title></head><body><h1>This is an example page</h1></body></html>";  // Conteúdo HTML inventado

    try {
        const response = await fetch('http://localhost:3000/save-page-html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageTitle: pageTitle,
                htmlContent: htmlContent
            })
        });

        if (response.ok) {
            console.log('Página HTML salva com sucesso.');
            const responseData = await response.text();
            console.log(responseData);
        } else {
            console.log('Falha ao salvar a página HTML:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

// Chamada da função
//saveHtmlPage();

async function uploadImage() {
    // Criar uma instância de FormData
    const formData = new FormData();

    // Adicionar o arquivo de imagem ao FormData
    // O caminho do arquivo deve ser ajustado conforme necessário
    const filePath = path.join(__dirname, 'imagem.jpg');
    formData.append('image', fs.createReadStream(filePath));

    // Opções de configuração para o request, incluindo os headers necessários
    const config = {
        headers: {
            ...formData.getHeaders() // Isso adiciona os headers necessários para o multipart/form-data
        }
    };

    try {
        // Enviar a requisição POST com axios
        const response = await axios.post('http://localhost:3000/upload-image', formData, config);
        console.log('Imagem enviada com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao enviar imagem:', error.response ? error.response.data : error.message);
    }
}

// Chamar a função de upload
uploadImage();