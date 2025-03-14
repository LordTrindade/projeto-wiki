

document.addEventListener('DOMContentLoaded', function() {
    // Encontra o elemento <ul> dentro de `list-text-content`
    const list = document.querySelector('.list-text-content ul');

    // Encontra todos os elementos com classe 'topic-title'
    const topics = document.querySelectorAll('.topic-title');

    // Itera sobre cada elemento 'topic-title'
    topics.forEach(topic => {
        const topicText = topic.textContent.trim(); // Obtém o texto do tópico e remove espaços extras
        const topicId = topicText.toLowerCase().replace(/\s+/g, '-'); // Cria um ID amigável para URL

        // Adiciona um novo item de lista com um link apontando para o ID do tópico
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${topicId}">${topicText}</a>`;
        list.appendChild(li);

        // Adiciona um ID ao elemento 'topic-title' para referência direta
        topic.setAttribute('id', topicId);
    });

    const clone = document.documentElement;
    const editableElements = clone.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'false');
    });
});