
// imageHandler.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const image_path = 'public/media/';

// Configuração do multer para armazenamento de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, image_path),
    filename: (req, file, cb) => cb(null, file.originalname)  // Mantém o nome original do arquivo
});

const upload = multer({ storage: storage }).single('image');

// Função para salvar imagem
const saveImage = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error("Erro do Multer:", err);
            return res.status(500).send("Erro do Multer ao carregar a imagem.");
        } else if (err) {
            console.error("Erro geral ao carregar a imagem:", err);
            return res.status(500).send("Erro ao carregar a imagem.");
        }
        req.imagePath = req.file.path; // multer disponibiliza req.file que contém detalhes do arquivo, incluindo o 'path'
        next();  // Chama a próxima função middleware ou termina a requisição
    });
};

// Função para recuperar uma imagem pelo título
const getImageByTitle = (title) => {
    return path.join(image_path, title);
};

// Função para listar imagens
const listImages = (callback) => {
    fs.readdir(image_path, (err, files) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, files);
        }
    });
};

module.exports = { saveImage, listImages, getImageByTitle };