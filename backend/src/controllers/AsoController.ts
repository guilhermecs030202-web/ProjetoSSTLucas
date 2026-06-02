import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AsoAtestado } from "../entities/AsoAtestado";

const asoRepository = AppDataSource.getRepository(AsoAtestado);

export class AsoController {
    static async create(req: Request, res: Response) {
        try {
            const novoAso = asoRepository.create(req.body);
            const resultado = await asoRepository.save(novoAso);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar ASO", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const asos = await asoRepository.find({ relations: ["funcionario", "funcionario.empresa", "examesClinicos"] });
            return res.json(asos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar ASOs", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const aso = await asoRepository.findOne({
                where: { idAso: id },
                relations: ["funcionario", "funcionario.empresa", "examesClinicos"]
            });
            if (!aso) {
                return res.status(404).json({ message: "ASO não encontrado" });
            }
            return res.json(aso);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar ASO", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const aso = await asoRepository.findOneBy({ idAso: id });
            if (!aso) {
                return res.status(404).json({ message: "ASO não encontrado" });
            }
            asoRepository.merge(aso, req.body);
            const resultado = await asoRepository.save(aso);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar ASO", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await asoRepository.delete(id);
            if (resultado.affected === 0) {
                return res.status(404).json({ message: "ASO não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar ASO", error });
        }
    }
}
