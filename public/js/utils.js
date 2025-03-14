
const imagesPath='../media/'

function normalizeTitle(title) {
    // Primeiro substitui letras acentuadas por suas equivalentes não acentuadas
    return title
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Remove diacríticos (acentos) do texto
        .replace(/[^a-zA-Z0-9]/g, '_');  // Substitui caracteres não alfanuméricos por '_'
}

function cleanTitle(input) {
    // Remove quebras de linha
    const noNewLines = input.replace(/[\r\n]+/g, '');

    // Substitui múltiplos espaços em branco por um único espaço
    const normalizedSpaces = noNewLines.replace(/\s+/g, ' ');

    return normalizedSpaces;
}

function getCompleteHTML() {
    // Clona o elemento documentElement para trabalhar com uma cópia sem alterar o DOM original
    const clone = document.documentElement.cloneNode(true);

    // Função auxiliar para remover elementos pelo ID
    function removeElementById(id) {
        const element = clone.querySelector(`#${id}`);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    function removeElementsByClass(className) {
        const elements = clone.querySelectorAll(`.${className}`);
        elements.forEach(element => {
            if (element) {
                element.parentNode.removeChild(element);
            }
        });
    }

    // Remove botões específicos pelo ID
    removeElementById('saveChanges');
    removeElementById('add-regular-content');
    removeElementById('remove-regular-content');
    removeElementById('add-row');
    removeElementById('remove-row');
    
    removeElementById('uploadForm');
    removeElementById('choose-image-profile');

    removeElementsByClass('form-container');

    // Remove scripts específicos pelo src
    function removeScriptBySrc(src) {
        const script = Array.from(clone.querySelectorAll('script')).find(s => s.getAttribute('src') === src);
        if (script) {
            script.parentNode.removeChild(script);
        }
    }

    removeScriptBySrc('/js/edition_script.js');
    removeScriptBySrc('/js/create_script.js');
    removeScriptBySrc('/js/creation_script.js');

    // Atualiza a src de cada imagem para apenas o nome do arquivo
    const images = clone.querySelectorAll('img');
    images.forEach(img => {
        const src = img.src.split('/').pop(); // Divide a URL pelo '/' e pega o último elemento
        //img.src = src; // Define a src da imagem para apenas o nome do arquivo
        img.src = imagesPath + src;
    });

    // Define todos os elementos com contenteditable="true" para "false"
    const editableElements = clone.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'false');
    });

    // Retorna o HTML completo modificado
    return clone.outerHTML;
}

function addScriptToHTML(outerHTML, scriptSrc) {
    // Criar um novo DOM Parser
    const parser = new DOMParser();
    
    // Parse o outerHTML para um documento DOM
    const doc = parser.parseFromString(outerHTML, "text/html");
    
    // Criar o elemento script
    const script = doc.createElement('script');
    script.src = scriptSrc;
    script.async = true; // Carregar o script de forma assíncrona, opcional

    // Adicionar o script antes do fechamento do body
    doc.body.appendChild(script);
    
    // Serializar o documento alterado de volta para HTML
    const serializer = new XMLSerializer();
    const updatedHTML = serializer.serializeToString(doc);
    
    return updatedHTML;
}

function getCompleteHTML_created_page(){

    originalHTML = getCompleteHTML();
    const scriptToAdd = '/js/created_page_script.js';

    const newHTML = addScriptToHTML(originalHTML, scriptToAdd);
    return newHTML;
}

function create_profile_image_input(){

    // Cria o formulário
    var form = document.createElement('form');
    form.id = 'uploadForm';
    form.action = '/upload';
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    form.style.display = 'flex';  // Usa flexbox para controlar o layout
    form.style.flexDirection = 'column';  // Alinha os elementos verticalmente

    // Cria o input de arquivo
    var input = document.createElement('input');
    input.type = 'file';
    input.name = 'image';
    input.required = true;

    // Cria o botão de envio
    var button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Enviar Imagem';
    button.style.marginBottom = '10px';  // Adiciona espaço entre o botão e o input

    // Adiciona o botão e o input ao formulário
    form.appendChild(input);
    form.appendChild(button);  // Botão abaixo do input

    return form;
}

function fetchImageList(callback) {
    fetch('/images-list')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao buscar imagens: ' + response.statusText);
        }
        return response.json();
    })
    .then(images => {
        callback(images);
    })
    .catch(error => {
        console.error('Erro ao buscar imagens:', error);
        callback([]); // Chama o callback com array vazio em caso de erro
    });
}

function createSelectProfileImageForm() {
    // Criando o formulário
    const form = document.createElement('form');
    form.id = 'choose-image-profile';

    // Criando o select menu
    const select = document.createElement('select');
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Ou escolha uma imagem';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Adicionando o select ao formulário
    form.appendChild(select);

    // Criando o botão de submissão
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Escolher Imagem';
    form.appendChild(button);

    // Buscar a lista de imagens e preencher o menu select
    fetchImageList(images => {
        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image; // Usar o nome do arquivo da imagem como texto da opção
            select.appendChild(option);
        });
    });

    // Retornar o formulário
    return form;
}



function add_regular_content_image_form(){

    const regularContents = document.querySelectorAll('.regular-content');
    regularContents.forEach((div, index) => {

        if (div.querySelector('.form-container')) {
            return; // Pula para a próxima iteração se já existir um formContainer
        }

        const uploadForm = createUploadForm(index);
        const selectForm = createSelectForm(index);

        // Criar container para os formulários e adicionar à div
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        formContainer.appendChild(uploadForm);
        formContainer.appendChild(selectForm);

        //create_button_delete_image_content(index,formContainer);
        //formContainer.appendChild(remove_button);

        div.appendChild(formContainer);
        add_listener_regular_content_select(index);
        add_listener_regular_content_upload(index);

        create_button_delete_image_content(index,formContainer);

    });
}

function createUploadForm(index){
    // Cria o formulário
    var form = document.createElement('form');
    form.setAttribute('data-index', index);
    form.action = '/upload';
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    form.style.display = 'flex';  // Usa flexbox para controlar o layout
    form.style.flexDirection = 'column';  // Alinha os elementos verticalmente

    // Cria o input de arquivo
    var input = document.createElement('input');
    input.type = 'file';
    input.name = 'image';
    input.required = true;

    // Input para legenda (caption)
    var captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.name = 'caption';
    captionInput.placeholder = 'Digite uma legenda para a imagem';
    captionInput.style.margin = '10px 0';  // Espaçamento

    // Cria o botão de envio
    var button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Enviar Imagem';
    button.style.marginBottom = '10px';  // Adiciona espaço entre o botão e o input

    // Adiciona o botão e o input ao formulário
    form.appendChild(input);
    form.appendChild(captionInput);
    form.appendChild(button);  // Botão abaixo do input

    return form;
}

function createSelectForm(index){
    const form = document.createElement('form');
    form.setAttribute('data-index-select', index);

    // Criando o select menu
    const select = document.createElement('select');
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Ou escolha uma imagem';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Input para legenda (caption)
    var captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.name = 'caption';
    captionInput.placeholder = 'Digite uma legenda para a imagem escolhida';
    captionInput.style.margin = '10px 0';  // Espaçamento

    // Criando o botão de submissão
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Escolher Imagem';

    form.appendChild(select);
    form.appendChild(captionInput);
    form.appendChild(button);

    // Buscar a lista de imagens e preencher o menu select
    fetchImageList(images => {
        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image; // Usar o nome do arquivo da imagem como texto da opção
            select.appendChild(option);
        });
    });

    // Retornar o formulário
    return form;
}

function add_listener_regular_content_select(index){
    const form = document.querySelector(`form[data-index-select='${index}']`);
    var divForm = form.parentNode;
    var regularContent = divForm.parentNode;
    var divImagens = regularContent.querySelector('.image-content');
    if (!divImagens) {
        console.error('Div .image-content não encontrada');
        return; // Termina a função se não encontrar a div esperada
    }

    if(form){
        form.addEventListener('submit',function(event){
            var divImagem = document.createElement('div');
            divImagem.className = 'image-content-element';
            var image = document.createElement('img');

            event.preventDefault();
            const selectElement = form.querySelector('select');
            const selectedImage = selectElement.value;
            image.src = imagesPath+selectedImage.split('/').pop();
            image.alt = `Imagem de título ${selectedImage}.`;
            var figcaption = document.createElement('figcaption');
            var captionText = form.querySelector('input[name="caption"]').value;
            figcaption.textContent = captionText;
            divImagem.appendChild(image);
            divImagem.appendChild(figcaption);
            divImagens.appendChild(divImagem);
            console.log(`Imagem ${selectedImage} adicionada com sucesso!`)
        });
    }
}

function add_listener_regular_content_upload(index){
    const form = document.querySelector(`form[data-index='${index}']`);
    var divForm = form.parentNode;
    var regularContent = divForm.parentNode;
    var divImagens = regularContent.querySelector('.image-content');

    if (!divImagens) {
        console.error('Div .image-content não encontrada');
        return; // Termina a função se não encontrar a div esperada
    }

    if(form){
        form.addEventListener('submit',function(event){
            var image = document.createElement('img');
            var divImagem = document.createElement('div');
            divImagem.className = 'image-content-element';
            
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/upload-image', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())  // Supondo que o servidor responde com JSON
            .then(data => {
                if (data.success) {
                    var source = data.imagePath;
                    console.log(`Imagem: ${source}`);
                    // Verifica se a string contém '/' (caminhos Unix/Linux) ou '\\' (caminhos Windows)
                    if (source.includes('/')) {
                        source = source.split('/').pop();
                    } else if (source.includes('\\')) {
                        source = source.split('\\').pop();
                    }
                    image.src = imagesPath+source; // 'data.imagePath' deve ser o caminho da imagem enviada
                    console.log(`Imagem: ${source}`);
                    image.alt = `Imagem de título ${source}.`; // Atualiza a descrição da imagem
                    var figcaption = document.createElement('figcaption');
                    var captionText = form.querySelector('input[name="caption"]').value;
                    figcaption.textContent = captionText;
                    divImagem.appendChild(image);
                    divImagem.appendChild(figcaption);
                    divImagens.appendChild(divImagem);

                } else {
                    alert('Falha ao enviar imagem');
                }
            })
            .catch(error => alert('Erro ao enviar imagem: ' + error));

        });
    }
}

function create_button_delete_image_content(index,form_div){
    const button = document.createElement('button');
    button.textContent = 'Remover Última Imagem';
    button.type = 'button';
    button.setAttribute('data-index-remove', index);
    form_div.appendChild(button);
    var regularContent = form_div.parentNode;
    var divImagens = regularContent.querySelector('.image-content');
    button.addEventListener('click', function() {
        // Encontrar a div 'image-content' que é irmã da 'form-container'
        if (!divImagens) {
            console.error('Div .image-content não encontrada');
            return;
        }

        // Encontrar a última div 'image-content-element' dentro de 'image-content'
        const imageElements = divImagens.querySelectorAll('.image-content-element');
        if (imageElements.length > 0) {
            // Selecionar o último elemento e removê-lo
            const lastImageElement = imageElements[imageElements.length - 1];
            lastImageElement.parentNode.removeChild(lastImageElement);
        } else {
            console.log('Nenhuma imagem para remover');
        }
    });
}



//////////////////////////////////////
export {normalizeTitle,getCompleteHTML,getCompleteHTML_created_page,
    cleanTitle,create_profile_image_input,fetchImageList,createSelectProfileImageForm,
    add_regular_content_image_form};