import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DistribuicaoEpi } from "../entities/DistribuicaoEpi";

const distribuicaoEpiRepository = AppDataSource.getRepository(DistribuicaoEpi);

export class DistribuicaoEpiController {
    static async create(req: Request, res: Response) {
        try {
            const novo = distribuicaoEpiRepository.create(req.body);
            const resultado = await distribuicaoEpiRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Distribuição", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const distribuicoes = await distribuicaoEpiRepository.find({ relations: ["itemCompra", "empresa"] });
            return res.json(distribuicoes);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar distribuições", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const distribuicao = await distribuicaoEpiRepository.findOne({ where: { idDistribuicao: id }, relations: ["itemCompra", "empresa"] });
            if (!distribuicao) return res.status(404).json({ message: "Distribuição não encontrada" });
            return res.json(distribuicao);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar distribuição", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const distribuicao = await distribuicaoEpiRepository.findOneBy({ idDistribuicao: id });
            if (!distribuicao) return res.status(404).json({ message: "Distribuição não encontrada" });
            distribuicaoEpiRepository.merge(distribuicao, req.body);
            const resultado = await distribuicaoEpiRepository.save(distribuicao);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar distribuição", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await distribuicaoEpiRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Distribuição não encontrada" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar distribuição", error });
        }
    }
}
