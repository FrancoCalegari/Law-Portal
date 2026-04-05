const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = process.env.SPIDER_API_URL.replace(/\/$/, '');
const API_KEY  = process.env.SPIDER_API_KEY;
const DB_NAME  = process.env.SPIDER_DB;

const headers = () => ({
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json'
});

/**
 * Ejecutar una consulta SQL en la base de datos remota.
 * @param {string} sql - Consulta SQL a ejecutar.
 * @returns {Promise<any>}
 */
async function query(sql) {
    const res = await axios.post(`${BASE_URL}/query`, {
        database: DB_NAME,
        query: sql
    }, { headers: headers() });
    return res.data;
}

/**
 * Listar los archivos de un proyecto en Cloud Storage.
 * @param {string|number} projectId
 * @returns {Promise<any[]>}
 */
async function listFiles(projectId) {
    const res = await axios.get(`${BASE_URL}/storage/projects/${projectId}/files`, {
        headers: { 'X-API-KEY': API_KEY }
    });
    return res.data;
}

/**
 * Subir un archivo al Cloud Storage dentro de un proyecto.
 * @param {string|number} projectId
 * @param {Buffer} buffer - Contenido del archivo.
 * @param {string} originalName - Nombre original del archivo.
 * @param {string} mimetype - MIME type del archivo.
 * @returns {Promise<any>} - Datos del archivo subido.
 */
async function uploadFile(projectId, buffer, originalName, mimetype) {
    const form = new FormData();
    form.append('files', buffer, {
        filename: originalName,
        contentType: mimetype
    });

    const res = await axios.post(
        `${BASE_URL}/storage/projects/${projectId}/files`,
        form,
        {
            headers: {
                'X-API-KEY': API_KEY,
                ...form.getHeaders()
            }
        }
    );
    return res.data;
}

/**
 * Eliminar un archivo del Cloud Storage por su ID.
 * @param {string|number} fileId
 * @returns {Promise<any>}
 */
async function deleteFile(fileId) {
    const res = await axios.delete(`${BASE_URL}/storage/files/${fileId}`, {
        headers: { 'X-API-KEY': API_KEY }
    });
    return res.data;
}

/**
 * Obtener información de un archivo por su ID.
 * @param {string|number} fileId
 * @returns {Promise<any>}
 */
async function getFileInfo(fileId) {
    const res = await axios.get(`${BASE_URL}/storage/files/${fileId}/info`, {
        headers: { 'X-API-KEY': API_KEY }
    });
    return res.data;
}

/**
 * Obtener la URL de descarga pública de un archivo.
 * @param {string|number} fileId
 * @returns {string}
 */
function getFileUrl(fileId) {
    return `${BASE_URL}/storage/files/${fileId}`;
}

module.exports = { query, listFiles, uploadFile, deleteFile, getFileInfo, getFileUrl };
