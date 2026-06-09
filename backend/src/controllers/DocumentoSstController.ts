import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DocumentoSst } from "../entities/DocumentoSst";
import fs from "fs";
import path from "path";

const documentoSstRepository = AppDataSource.getRepository(DocumentoSst);

export class DocumentoSstController {
    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            if (req.file) {
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.path;
            }
            const novo = documentoSstRepository.create(data);
            const resultado = await documentoSstRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Documento SST", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const documentos = await documentoSstRepository.find({ relations: ["empresa"] });
            return res.json(documentos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar documentos", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const doc = await documentoSstRepository.findOne({ where: { idDocumento: id }, relations: ["empresa"] });
            if (!doc) return res.status(404).json({ message: "Documento SST não encontrado" });
            return res.json(doc);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar documento", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const doc = await documentoSstRepository.findOneBy({ idDocumento: id });
            if (!doc) return res.status(404).json({ message: "Documento SST não encontrado" });
            
            const data = req.body;
            if (req.file) {
                if (doc.caminhoArquivo && fs.existsSync(doc.caminhoArquivo)) {
                    fs.unlinkSync(doc.caminhoArquivo);
                }
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.path;
            }

            documentoSstRepository.merge(doc, data);
            const resultado = await documentoSstRepository.save(doc);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar documento", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const doc = await documentoSstRepository.findOneBy({ idDocumento: id });
            if (!doc) return res.status(404).json({ message: "Documento SST não encontrado" });

            if (doc.caminhoArquivo && fs.existsSync(doc.caminhoArquivo)) {
                fs.unlinkSync(doc.caminhoArquivo);
            }

            await documentoSstRepository.remove(doc);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar documento", error });
        }
    }

    static async download(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const doc = await documentoSstRepository.findOneBy({ idDocumento: id });
            if (!doc || !doc.caminhoArquivo || !fs.existsSync(doc.caminhoArquivo)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.download(doc.caminhoArquivo, doc.nomeArquivo);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao baixar documento", error });
        }
    }

    static async view(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const doc = await documentoSstRepository.findOneBy({ idDocumento: id });
            if (!doc || !doc.caminhoArquivo || !fs.existsSync(doc.caminhoArquivo)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.setHeader("Content-Type", doc.mimeType || "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${doc.nomeArquivo}"`);
            const fileStream = fs.createReadStream(doc.caminhoArquivo);
            fileStream.pipe(res);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao visualizar documento", error });
        }
    }
}
