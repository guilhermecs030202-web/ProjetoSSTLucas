import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MembroCipa } from "../entities/MembroCipa";

const membroCipaRepository = AppDataSource.getRepository(MembroCipa);

export class MembroCipaController {
    static async create(req: Request, res: Response) {
        try {
            const novo = membroCipaRepository.create(req.body);
            const resultado = await membroCipaRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Membro CIPA", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const membros = await membroCipaRepository.find({ relations: ["empresa"] });
            return res.json(membros);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar membros", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const membro = await membroCipaRepository.findOne({ where: { idMembro: id }, relations: ["empresa"] });
            if (!membro) return res.status(404).json({ message: "Membro CIPA não encontrado" });
            return res.json(membro);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar membro", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const membro = await membroCipaRepository.findOneBy({ idMembro: id });
            if (!membro) return res.status(404).json({ message: "Membro CIPA não encontrado" });
            membroCipaRepository.merge(membro, req.body);
            const resultado = await membroCipaRepository.save(membro);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar membro", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resultado = await membroCipaRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Membro CIPA não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar membro", error });
        }
    }
}
