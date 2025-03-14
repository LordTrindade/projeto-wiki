const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Middlewares para parsear o corpo das requisições
app.use(express.json());  // Para parsing de application/json
app.use(express.urlencoded({ extended: true }));  // Para parsing de application/x-www-form-urlencoded

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Se 'views' é uma subpasta de 'public'
app.use('/views', express.static(path.join(__dirname, 'views')));

// Diretório base para os arquivos estáticos
const publicDirectoryPath = path.join(__dirname, 'public');
// Servir arquivos estáticos
app.use(express.static(publicDirectoryPath));
// Se quiser criar rotas específicas para cada tipo de arquivo
app.use('/css', express.static(path.join(publicDirectoryPath, 'css')));
app.use('/js', express.static(path.join(publicDirectoryPath, 'js')));

// Roteador para rotas principais
const indexRouter = require('./server/routes/index');
app.use('/', indexRouter);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
