
import { getCompleteHTML_created_page } from './utils.js';
import { cleanTitle } from './utils.js';

import { create_profile_image_input } from './utils.js';
import { createSelectProfileImageForm } from './utils.js';
import { add_regular_content_image_form } from './utils.js';

const imagesPath='../media/'

document.addEventListener('DOMContentLoaded', function() {
    const editables = document.querySelectorAll('.main-content p, .topic-title, .page-title, .intro-table, figcaption');
    editables.forEach(element => element.setAttribute('contenteditable', 'true'));
});

document.getElementById('saveChanges').addEventListener('click', async function() {
    const pageTitle_ = cleanTitle(document.querySelector('.page-title').textContent)
    const data = {
        pageTitle: pageTitle_,
        introText: document.querySelector('.intro-text p').textContent,
        profileImage: imagesPath+document.querySelector('.intro-table-img img') ? document.querySelector('.intro-table-img img').src.split('/').pop() : null,
        tableData: [...document.querySelectorAll('.profile-info-table tr')].map(tr => {
            const th = tr.querySelector('th').textContent;
            const td = tr.querySelector('td').textContent;
            return { [th]: td };
        }),
        topics: [...document.querySelectorAll('.regular-content')].map(topic => {
            const title = topic.querySelector('.topic-title').textContent.trim(); // Assegura captura apenas do título
            const content = topic.querySelectorAll('p')[1] ? topic.querySelectorAll('p')[1].textContent : ''; // Assegura captura do segundo parágrafo, se existir
            return {
                title: title,
                content: content,
                images: [...topic.querySelectorAll('.image-content-element')].map(imgDiv => {
                    return {
                        src: imgDiv.querySelector('img').src.split('/').pop(), // Pega apenas o nome do arquivo da imagem
                        caption: imgDiv.querySelector('figcaption').textContent,
                        description: imgDiv.querySelector('img').alt
                    };
                })
            };
        }),
        topicList: [...document.querySelectorAll('.list-text-content li a')].map(li => li.textContent)
    };

    console.log(JSON.stringify(data)); // Exibe o JSON atualizado no console
    // Aqui você pode enviar o JSON para um servidor ou salvar localmente
    
    await saveJsonPage(data);
    await saveHtmlPage(pageTitle_);


});

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.profile-info-table');

    // Botão para adicionar uma nova linha
    document.getElementById('add-row').addEventListener('click', function() {
        const newRow = document.createElement('tr');

        // Cria uma célula de cabeçalho com um placeholder
        const newHeader = document.createElement('th');
        newHeader.textContent = 'Placeholder'; // Cabeçalho padrão
        newRow.appendChild(newHeader);

        // Cria uma célula de dados com um valor padrão
        const newData = document.createElement('td');
        newData.textContent = 'Valor'; // Valor padrão
        newRow.appendChild(newData);

        // Adiciona a nova linha à tabela
        table.appendChild(newRow);
    });

    // Botão para remover a última linha
    document.getElementById('remove-row').addEventListener('click', function() {
        const rows = table.querySelectorAll('tr');
        if (rows.length > 0) {
            table.removeChild(rows[rows.length - 1]); // Remove a última linha
        } else {
            alert('Não há mais linhas para remover!');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('.main-content');

    // Botão para adicionar novo conteúdo regular
    document.getElementById('add-regular-content').addEventListener('click', function() {
        // Cria uma nova div regular-content
        const newContent = document.createElement('div');
        newContent.className = 'regular-content';
        newContent.innerHTML = `
            <div class="topic-title" contenteditable="true"><p>Novo Tópico</p></div>
            <hr>
            <p contenteditable="true">Conteúdo novo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div class="image-content"></div>
        `;

        // Adiciona a nova div ao main-content
        mainContent.appendChild(newContent);
        add_regular_content_image_form();
        ensureControlsAtEnd(); // Chama a função para garantir a posição dos controles
    });

    // Botão para remover o último conteúdo regular
    document.getElementById('remove-regular-content').addEventListener('click', function() {
        const allContents = mainContent.querySelectorAll('.regular-content');
        if (allContents.length > 0) {
            mainContent.removeChild(allContents[allContents.length - 1]); // Remove o último
            ensureControlsAtEnd();
        } else {
            alert('Não há mais conteúdo para remover!');
        }
    });
});




//por content-controls la no fim
function ensureControlsAtEnd() {
    const mainContent = document.querySelector('.main-content');
    const controls = document.querySelector('.content-controls');
    mainContent.appendChild(controls); // Isso move os controles para o final, mesmo que já estejam lá
}

async function saveHtmlPage(page_title) {
    const pageTitle = page_title;
    const  html_content = getCompleteHTML_created_page();

    try {
        const response = await fetch('/save-page-html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageTitle: pageTitle,
                htmlContent: html_content
            })
        });

        if (response.ok) {
            console.log('Página HTML salva com sucesso.');
           // const responseData = await response.text();
            //console.log(responseData);
        } else {
            console.log('Falha ao salvar a página HTML:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

async function saveJsonPage(data) {
    // Envio do JSON atualizado para o servidor via PUT
    try {
        const response = await fetch('/save-page-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('JSON atualizado com sucesso.');
        } else {
            console.log('Falha ao atualizar JSON:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    };
}

document.addEventListener('DOMContentLoaded', function(){
    var form = create_profile_image_input();
    var div_profile = document.querySelector('.intro-table-img');
    div_profile.appendChild(form);
    add_listener_profile_image_input();

    var form2 = createSelectProfileImageForm();
    div_profile.appendChild(form2);
    add_listener_profile_image_chooser();
});

function add_listener_profile_image_input(){
    const uploadForm = document.getElementById('uploadForm');
    if (!uploadForm) {
        console.error('Formulário de upload não encontrado!');
        return;
    }

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

        const formData = new FormData(this); // 'this' refere-se ao formulário
        const imageContainer = document.querySelector('.intro-table-img img');

        fetch('/upload-image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())  // Supondo que o servidor responde com JSON
        .then(data => {
            if (data.success) {
                // Atualiza a imagem na div 'intro-table-img' com o novo caminho da imagem enviada
                imageContainer.src = data.imagePath; // 'data.imagePath' deve ser o caminho da imagem enviada
                imageContainer.alt = "Foto de Perfil"; // Atualiza a descrição da imagem
            } else {
                alert('Falha ao enviar imagem');
            }
        })
        .catch(error => alert('Erro ao enviar imagem: ' + error));
    });
}

function add_listener_profile_image_chooser(){
    const form = document.getElementById('choose-image-profile');
    const imageContainer = document.querySelector('.intro-table-img img');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede que o formulário seja enviado e a página recarregada
            const selectElement = form.querySelector('select');
            const selectedImage = selectElement.value; // Obtém o valor da opção selecionada, que é o nome da imagem
            //console.log('Imagem selecionada:', selectedImage); // Aqui você pode fazer outras operações com o nome da imagem
            imageContainer.src = imagesPath + selectedImage;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    add_regular_content_image_form();
});