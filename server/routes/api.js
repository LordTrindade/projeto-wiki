const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// API para salvar JSON
router.post('/save', (req, res) => {
    const jsonData = req.body;
    const jsonPath = path.join(__dirname, '../data/page.json'); // Exemplo de nome de arquivo
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData));
    res.send({ status: 'success' });
});

module.exports = router;
