import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AcidenteTrabalho } from "../entities/AcidenteTrabalho";
import fs from "fs";
import { getAbsoluteFilePath, deleteFileIfExists } from "../utils/fileStorage";

const acidenteRepository = AppDataSource.getRepository(AcidenteTrabalho);

export class AcidenteTrabalhoController {
    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            if (req.file) {
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.filename;
            }
            const novo = acidenteRepository.create(data);
            const resultado = await acidenteRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Acidente de Trabalho", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const acidentes = await acidenteRepository.find({ relations: ["funcionario", "funcionario.empresa"] });
            return res.json(acidentes);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar acidentes", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const acidente = await acidenteRepository.findOne({ where: { idAcidente: id }, relations: ["funcionario", "funcionario.empresa"] });
            if (!acidente) return res.status(404).json({ message: "Acidente de Trabalho não encontrado" });
            return res.json(acidente);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar acidente", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const acidente = await acidenteRepository.findOneBy({ idAcidente: id });
            if (!acidente) return res.status(404).json({ message: "Acidente de Trabalho não encontrado" });

            const data = req.body;
            if (req.file) {
                if (acidente.caminhoArquivo) {
                    deleteFileIfExists(acidente.caminhoArquivo);
                }
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.filename;
            }

            acidenteRepository.merge(acidente, data);
            const resultado = await acidenteRepository.save(acidente);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar acidente", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const acidente = await acidenteRepository.findOneBy({ idAcidente: id });
            if (!acidente) return res.status(404).json({ message: "Acidente de Trabalho não encontrado" });

            if (acidente.caminhoArquivo) {
                deleteFileIfExists(acidente.caminhoArquivo);
            }

            await acidenteRepository.remove(acidente);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar acidente", error });
        }
    }

    static async download(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const acidente = await acidenteRepository.findOneBy({ idAcidente: id });
            const filePath = acidente?.caminhoArquivo ? getAbsoluteFilePath(acidente.caminhoArquivo) : "";
            if (!acidente || !filePath || !fs.existsSync(filePath)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.download(filePath, acidente.nomeArquivo);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao baixar documento", error });
        }
    }

    static async view(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const acidente = await acidenteRepository.findOneBy({ idAcidente: id });
            const filePath = acidente?.caminhoArquivo ? getAbsoluteFilePath(acidente.caminhoArquivo) : "";
            if (!acidente || !filePath || !fs.existsSync(filePath)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.setHeader("Content-Type", acidente.mimeType || "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${acidente.nomeArquivo}"`);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao visualizar documento", error });
        }
    }
}
