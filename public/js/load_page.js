

import { normalizeTitle } from './utils.js';



async function fetchJsonContent(title) {
    try {
        const response = await fetch(`/get-json/${title}`);
        if (response.ok) {
            const jsonData = await response.json();
            //console.log(jsonData);
            return jsonData;
        } else {
            console.error('Failed to fetch JSON:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

export async function editPage(pageTitle) {
    //console.log(`Visualizar página: ${pageTitle}`);
    const title = normalizeTitle(pageTitle)
    //console.log(`Visualizar página: ${title}`);
    const json_page = await fetchJsonContent(title)
    //console.log(`json is: ${json_page}`)
    localStorage.setItem('current_page_json', JSON.stringify(json_page));
    //console.log(`local storage is: ${localStorage}`)
    //pagina = funcao que carrega pagina passando json de argumento 
    //const html_page = getEditionTemplate();
    //window.location.href = html_page;
    window.location.href = '/../../views/teste_edicao.html';
}