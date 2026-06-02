import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DocumentoSst } from "../entities/DocumentoSst";

const documentoSstRepository = AppDataSource.getRepository(DocumentoSst);

export class DocumentoSstController {
    static async create(req: Request, res: Response) {
        try {
            const novo = documentoSstRepository.create(req.body);
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
            documentoSstRepository.merge(doc, req.body);
            const resultado = await documentoSstRepository.save(doc);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar documento", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await documentoSstRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Documento SST não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar documento", error });
        }
    }
}
