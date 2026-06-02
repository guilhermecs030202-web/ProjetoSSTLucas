import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AcidenteTrabalho } from "../entities/AcidenteTrabalho";

const acidenteRepository = AppDataSource.getRepository(AcidenteTrabalho);

export class AcidenteTrabalhoController {
    static async create(req: Request, res: Response) {
        try {
            const novo = acidenteRepository.create(req.body);
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
            acidenteRepository.merge(acidente, req.body);
            const resultado = await acidenteRepository.save(acidente);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar acidente", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await acidenteRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Acidente de Trabalho não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar acidente", error });
        }
    }
}
