import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ExameClinico } from "../entities/ExameClinico";

const exameClinicoRepository = AppDataSource.getRepository(ExameClinico);

export class ExameClinicoController {
    static async create(req: Request, res: Response) {
        try {
            const novo = exameClinicoRepository.create(req.body);
            const resultado = await exameClinicoRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Exame Clínico", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const exames = await exameClinicoRepository.find({ relations: ["aso"] });
            return res.json(exames);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar exames clínicos", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const exame = await exameClinicoRepository.findOne({ where: { idExame: id }, relations: ["aso"] });
            if (!exame) return res.status(404).json({ message: "Exame Clínico não encontrado" });
            return res.json(exame);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar exame", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const exame = await exameClinicoRepository.findOneBy({ idExame: id });
            if (!exame) return res.status(404).json({ message: "Exame Clínico não encontrado" });
            exameClinicoRepository.merge(exame, req.body);
            const resultado = await exameClinicoRepository.save(exame);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar exame", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resultado = await exameClinicoRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Exame Clínico não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar exame", error });
        }
    }
}
