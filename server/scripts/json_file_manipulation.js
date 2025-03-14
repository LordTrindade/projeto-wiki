const { json } = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');

const { normalizeTitle } = require('./utils');

// Promisify fs.readdir and fs.readFile for use with async/await
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function getJsonPageList() {
    //const directoryPath = path.join(__dirname, 'data', 'json');
    const directoryPath = path.join(__dirname, '../../data/json');
    //directoryPath = ('data/json') 
    try {
        // Read all files in the directory
        const files = await fs.promises.readdir(directoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        const dataList = [];

        for (const file of jsonFiles) {
            const filePath = path.join(directoryPath, file);
            const fileContent = await readFile(filePath, 'utf8');
            const jsonData = JSON.parse(fileContent);
            
            // Extract specific fields and save them into the list
            const { pageTitle, introText, profileImage } = jsonData;
            dataList.push({ pageTitle, introText, profileImage });
        }

        return dataList;
    } catch (error) {
        console.error('Error reading the JSON files:', error);
        throw error; // rethrow the error after logging
    }
};

async function getJsonPageByTitle(title) {
    const directoryPath = path.join(__dirname, '../../data/json');
    try {
        // Ler todos os arquivos no diretório
        const files = await fs.promises.readdir(directoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        console.log(`found files: ${jsonFiles}`)
        const filePath = path.join(directoryPath, title+'.json');
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        return jsonData;
        
        /*
        for (const file of jsonFiles) {
            const filePath = path.join(directoryPath, file);
            //console.log(`procurando arquivo: ${filePath}`);
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(fileContent);
            
            // Verificar se o título do JSON corresponde ao título fornecido
            if (jsonData.pageTitle === title) {
                return jsonData;  // Retorna o JSON correspondente
            }
        }
            */

        // Se nenhum arquivo for encontrado com o título fornecido, retorne null ou uma mensagem
        return {};  // Ou pode lançar uma exceção ou retornar uma mensagem de erro
    } catch (error) {
        if (error.code === 'ENOENT'){
            return {};
        }else{
        console.error('Error reading the JSON file:', error);
        throw error; // Relança o erro após o log
        }
    }
}


async function jsonPageExists(title) {
    const directoryPath = path.join(__dirname, '../../data/json');
    try {
        // Ler todos os arquivos no diretório
        const files = await fs.promises.readdir(directoryPath);
        const jsonFileName = normalizeTitle(title) + '.json'; // Normaliza o título para o formato de nome de arquivo

        // Verifica se o arquivo com o nome especificado existe
        return files.includes(jsonFileName);
    } catch (error) {
        console.error('Error checking JSON file existence:', error);
        throw error; // Relança o erro após o log
    }
}

// Função para salvar o JSON em um arquivo
async function saveJsonToFile(filePath, data) {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        return true; // Retornar true em caso de sucesso
    } catch (error) {
        console.error('Erro ao salvar o JSON:', error);
        return false; // Retornar false em caso de falha
    }
}

async function deleteJsonFile(filePath) {
    try {
        await fs.promises.unlink(filePath);  // Exclui o arquivo especificado
        return true;  // Retorna true em caso de sucesso
    } catch (error) {
        console.error('Erro ao deletar o JSON:', error);
        return false;  // Retorna false em caso de falha
    }
}

module.exports={
    getJsonPageList,
    saveJsonToFile,
    deleteJsonFile,
    getJsonPageByTitle,
    jsonPageExists
};