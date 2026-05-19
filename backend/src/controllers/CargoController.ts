import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Cargo } from "../entities/Cargo";

const cargoRepository = AppDataSource.getRepository(Cargo);

export class CargoController {
    static async create(req: Request, res: Response) {
        try {
            const novoCargo = cargoRepository.create(req.body);
            const resultado = await cargoRepository.save(novoCargo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar cargo", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const cargos = await cargoRepository.find({ relations: ["empresa"] });
            return res.json(cargos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar cargos", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cargo = await cargoRepository.findOne({ where: { idCargo: id }, relations: ["empresa"] });
            if (!cargo) return res.status(404).json({ message: "Cargo não encontrado" });
            return res.json(cargo);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar cargo", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cargo = await cargoRepository.findOneBy({ idCargo: id });
            if (!cargo) return res.status(404).json({ message: "Cargo não encontrado" });
            cargoRepository.merge(cargo, req.body);
            const resultado = await cargoRepository.save(cargo);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar cargo", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resultado = await cargoRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Cargo não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar cargo", error });
        }
    }
}
