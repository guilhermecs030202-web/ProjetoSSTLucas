import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Treinamento } from "../entities/Treinamento";
import fs from "fs";
import path from "path";

const treinamentoRepository = AppDataSource.getRepository(Treinamento);

export class TreinamentoController {
    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            if (req.file) {
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.path;
            }
            const novo = treinamentoRepository.create(data);
            const resultado = await treinamentoRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Treinamento", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const treinamentos = await treinamentoRepository.find({ relations: ["funcionario", "funcionario.empresa"] });
            return res.json(treinamentos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar treinamentos", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const treino = await treinamentoRepository.findOne({ where: { idTreinamento: id }, relations: ["funcionario", "funcionario.empresa"] });
            if (!treino) return res.status(404).json({ message: "Treinamento não encontrado" });
            return res.json(treino);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar treinamento", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const treino = await treinamentoRepository.findOneBy({ idTreinamento: id });
            if (!treino) return res.status(404).json({ message: "Treinamento não encontrado" });

            const data = req.body;
            if (req.file) {
                if (treino.caminhoArquivo && fs.existsSync(treino.caminhoArquivo)) {
                    fs.unlinkSync(treino.caminhoArquivo);
                }
                data.nomeArquivo = req.file.originalname;
                data.mimeType = req.file.mimetype;
                data.tamanhoArquivo = req.file.size;
                data.caminhoArquivo = req.file.path;
            }

            treinamentoRepository.merge(treino, data);
            const resultado = await treinamentoRepository.save(treino);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar treinamento", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const treino = await treinamentoRepository.findOneBy({ idTreinamento: id });
            if (!treino) return res.status(404).json({ message: "Treinamento não encontrado" });

            if (treino.caminhoArquivo && fs.existsSync(treino.caminhoArquivo)) {
                fs.unlinkSync(treino.caminhoArquivo);
            }

            await treinamentoRepository.remove(treino);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar treinamento", error });
        }
    }

    static async download(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const treino = await treinamentoRepository.findOneBy({ idTreinamento: id });
            if (!treino || !treino.caminhoArquivo || !fs.existsSync(treino.caminhoArquivo)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.download(treino.caminhoArquivo, treino.nomeArquivo);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao baixar documento", error });
        }
    }

    static async view(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const treino = await treinamentoRepository.findOneBy({ idTreinamento: id });
            if (!treino || !treino.caminhoArquivo || !fs.existsSync(treino.caminhoArquivo)) {
                return res.status(404).json({ message: "Arquivo não encontrado" });
            }
            res.setHeader("Content-Type", treino.mimeType || "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${treino.nomeArquivo}"`);
            const fileStream = fs.createReadStream(treino.caminhoArquivo);
            fileStream.pipe(res);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao visualizar documento", error });
        }
    }
}
