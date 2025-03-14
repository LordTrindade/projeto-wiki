
//import fetchJsonData from 'json_file_manipulation.js'
//const fetchJsonData = require('json_file_manipulation.js');

//const { viewPage } = require('../public/js/load_page');
import { editPage } from './load_page.js';
import { normalizeTitle } from './utils.js';

async function fetchJsonData() {
    const response = await fetch('/get-page-list-json'); // Ajuste o endpoint conforme necessário
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json(); // Converte a resposta em JSON
}

function generateTable(dataList) {
    const img_source_basic = './media/';
    let tableHTML = '<table class="table-main-page-list">';
    tableHTML += '<tr><th>Título da Página</th><th>Texto de Introdução</th><th>Imagem do Perfil</th><th>Link</th><th>Edição</th></tr>';

    for (const item of dataList) {
        const img_url = img_source_basic + item.profileImage;
        var title = normalizeTitle(item.pageTitle);
        tableHTML += `<tr>
                        <td>${item.pageTitle}</td>
                        <td>${item.introText.substring(0, 100)}...</td>
                        <td><img src="${img_url}" alt="Profile Image" style="width:100px; height:auto;"></td>
                        <td><a href="./html_page/${title}.html">Ver Página</a></td>
                        <td><button data-title="${item.pageTitle}">Editar Página</button></td>
                      </tr>`;
    }

    tableHTML += '</table>';
    return tableHTML;
}

function addTableEventListener() {
    const table = document.querySelector('.table-main-page-list');
    if (table) {
        table.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'BUTTON') {
                const pageTitle = target.getAttribute('data-title');
                editPage(pageTitle);
            }
        });
    } else {
        console.error("Table not found!");
    }
}



function insertTableIntoDiv(tableHTML) {
    const tableContainer = document.querySelector('.table-pages');
    tableContainer.innerHTML = tableHTML; // Insere a tabela HTML dentro da div
}


async function fetchAndDisplayData() {
    try {
        const dataList = await fetchJsonData(); // Chama a função que busca os dados JSON
        const tableHTML = generateTable(dataList); // Gera a tabela HTML a partir dos dados
        insertTableIntoDiv(tableHTML); // Insere a tabela na div
        addTableEventListener()
    } catch (err) {
        console.error('Failed to fetch and display data:', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayData(); // Chama a função ao carregar o documento
});


function addBotaoCriarEventListener() {
    const table = document.querySelector('.table-main-page-list');
    if (table) {
        table.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'BUTTON') {
                const pageTitle = target.getAttribute('data-title');
                editPage(pageTitle);
            }
        });
    } else {
        console.error("Table not found!");
    }
}