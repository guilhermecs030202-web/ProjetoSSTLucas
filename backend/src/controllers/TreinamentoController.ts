import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Treinamento } from "../entities/Treinamento";

const treinamentoRepository = AppDataSource.getRepository(Treinamento);

export class TreinamentoController {
    static async create(req: Request, res: Response) {
        try {
            const novo = treinamentoRepository.create(req.body);
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
            treinamentoRepository.merge(treino, req.body);
            const resultado = await treinamentoRepository.save(treino);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar treinamento", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await treinamentoRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Treinamento não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar treinamento", error });
        }
    }
}
