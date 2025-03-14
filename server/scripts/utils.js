

function normalizeTitle(title) {
    // Primeiro substitui letras acentuadas por suas equivalentes não acentuadas
    return title
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Remove diacríticos (acentos) do texto
        .replace(/[^a-zA-Z0-9]/g, '_');  // Substitui caracteres não alfanuméricos por '_'
}


module.exports = {
    normalizeTitle
};