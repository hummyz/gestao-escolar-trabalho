import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import db from './db.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
console.log("FileName: ",__filename)
const __dirname = path.dirname(__filename)
console.log("DirName: ", __dirname)
const baseDir = path.join(__dirname, 'templates')
console.log("BaseDir: ", baseDir)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res)=>res.sendFile(path.join(baseDir, 'index.html')))
app.listen(PORT, () => {console.log('Server is running on http://localhost:'+PORT)})
app.get('/listar/alunos', async (req,res)=>{
    try {
        const dados = await db.query('SELECT * FROM aluno;')
        res.status(200).json([{message:'Sucesso.'}, dados])
    } catch (erro) {
        res.status(500).json([{Message:'Erro do servidor.'}, erro])
    }
})
app.get('/listar/:tabela', async (req, res) => {
    try {
        const { tabela } = req.params;

        const tabelasPermitidas = ['aluno', 'docente', 'curso'];

        if (!tabelasPermitidas.includes(tabela.toLowerCase())) {
            return res.status(400).json({
                message: 'Tabela inválida.'
            });
        }

        const dados = await db.query(`SELECT * FROM ${tabela};`);

        res.status(200).json({
            message: 'Sucesso.',
            dados: dados.rows
        });

    } catch (erro) {
        res.status(500).json({
            message: 'Erro do servidor.',
            erro: erro.message
        });
    }
});