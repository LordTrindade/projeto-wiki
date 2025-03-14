

const fs = require('fs');
const express = require('express');
const path = require('path');
const { normalizeTitle } = require('./utils.js');

function saveHtmlFile(title, htmlContent) {
    const fileName = normalizeTitle(title) + '.html';
    const filePath = path.join('./public/html_page', fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, htmlContent, (err) => {
            if (err) {
                //console.error('Error saving HTML file:', err);
                reject(err);
            } else {
                //console.log('HTML file saved successfully:', filePath);
                resolve(true);
            }
        });
    });
}

function getHtmlFile(title) {
    const fileName = normalizeTitle(title) + '.html';
    const filePath = path.join(__dirname, 'html_page', fileName);

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                reject('File not found or unable to read file.');
            } else {
                console.log('HTML file read successfully:');
                resolve(data);
            }
        });
    });
}

function getEditionTemplateFile() {
    const fileName = 'teste_edicao.html'
    const filePath = '././views'+ fileName;

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                reject('File not found or unable to read file.');
            } else {
                console.log('HTML file read successfully:');
                resolve(data);
            }
        });
    });
}

async function deleteHtmlFile(title) {
    const fileName = normalizeTitle(title) + '.html';
    const filePath = path.join(__dirname, 'html_page', fileName);

    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting HTML file:', err);
                reject(err);  // Rejeita a promessa se houver um erro
            } else {
                console.log('HTML file deleted successfully:', filePath);
                resolve();  // Resolve a promessa sem um valor
            }
        });
    });
}

module.exports={
    saveHtmlFile,
    getHtmlFile,
    getEditionTemplateFile,
    deleteHtmlFile
};