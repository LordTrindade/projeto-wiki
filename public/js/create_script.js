
//import { create_profile_image_input } from './utils.js';
const imagesPath='../media/'



document.addEventListener('DOMContentLoaded', function() {

    data = localStorage.getItem('current_page_json');
    data = JSON.parse(data)

    // Titulo da pagina
    document.querySelector('.page-title').textContent = data.pageTitle;
    document.querySelector('.intro-table-title').textContent = data.pageTitle;

    // Set intro text
    document.querySelector('.intro-text p').textContent = data.introText;

    // Imagem perfil
    var imageContainer = document.querySelector('.intro-table-img');
    // Criar um elemento de imagem
    var imgElement = document.createElement('img');
    imgElement.src = imagesPath+data.profileImage; // Supondo que você quer usar "profileImage"
    imgElement.alt = "Foto de perfil"; // Descrição estática, alterar se necessário
    // Adicionar a imagem ao container
    imageContainer.appendChild(imgElement);

    //Tabela de perfil
    var table = document.querySelector('.profile-info-table');
    // Iterar sobre cada par de dados em tableData
    if(data.tableData){
        data.tableData.forEach(function(item) {
            // Cada item é um objeto onde cada chave e valor representam uma linha da tabela
            for (var key in item) {
                var tr = document.createElement('tr'); // Criar uma nova linha

                var th = document.createElement('th'); // Criar o elemento cabeçalho da célula
                th.textContent = key; // Definir o texto do cabeçalho (e.g., Nome, Idade)

                var td = document.createElement('td'); // Criar o elemento célula de dados
                td.textContent = item[key]; // Definir o texto da célula com o valor correspondente

                tr.appendChild(th); // Adicionar o cabeçalho à linha
                tr.appendChild(td); // Adicionar a célula de dados à linha

                table.appendChild(tr); // Adicionar a linha à tabela
            }
        });
    }

    // Localizar a div main-content onde os tópicos serão inseridos
    var mainContent = document.querySelector('.main-content');

    data.topics.forEach(function(topic) {
        // Criar a div para o conteúdo regular de cada tópico
        var regularContent = document.createElement('div');
        regularContent.className = 'regular-content';

        // Criar e adicionar o título do tópico
        var topicTitle = document.createElement('div');
        regularContent.id = topic.title.toLowerCase().replace(/\s+/g, '-'); // Substitui espaços por hífens e converte para minúsculas
        topicTitle.className = 'topic-title';
        topicTitle.innerHTML = `<p>${topic.title}</p>`;
        regularContent.appendChild(topicTitle);

        // Adicionar uma linha horizontal
        regularContent.appendChild(document.createElement('hr'));

        // Criar e adicionar o parágrafo com o conteúdo
        var topicContent = document.createElement('p');
        topicContent.textContent = topic.content;
        regularContent.appendChild(topicContent);

        // Verificar se existem imagens e adicioná-las se existirem
        var imageContent = document.createElement('div');
        imageContent.className = 'image-content';
        if (topic.images.length > 0) {
            topic.images.forEach(function(image) {
                var imageElement = document.createElement('div');
                imageElement.className = 'image-content-element';

                var img = document.createElement('img');
                img.src = imagesPath+image.src;
                img.alt = image.description; // Usando 'description' para o atributo alt

                var caption = document.createElement('figcaption');
                caption.textContent = image.caption;

                imageElement.appendChild(img);
                imageElement.appendChild(caption);
                imageContent.appendChild(imageElement);
            });
        }
        regularContent.appendChild(imageContent);




        // Adicionar o conteúdo regular ao main-content
        mainContent.appendChild(regularContent);
    });

    //Lista de topicos
    var list = document.querySelector('.list-text-content ul');
    // Sempre adicionar 'Introdução' como primeiro item
    var introLi = document.createElement('li');
    introLi.innerHTML = '<a href="#introducao">Introdução</a>';
    list.appendChild(introLi);
    // Adicionar cada tópico do JSON como um item da lista
    data.topics.forEach(function(topic) {
        var li = document.createElement('li');
        li.innerHTML = `<a href="#${topic.title.toLowerCase().replace(/\s/g, '-')}" >${topic.title}</a>`;
        list.appendChild(li);
    });
    
    ensureControlsAtEnd();
});

//por content-controls la no fim
function ensureControlsAtEnd() {
    const mainContent = document.querySelector('.main-content');
    const controls = document.querySelector('.content-controls');
    var linebreak = document.createElement('br');
    mainContent.appendChild(linebreak);
    mainContent.appendChild(controls); // Isso move os controles para o final, mesmo que já estejam lá
}
