import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Funcionario } from "../entities/Funcionario";

const funcionarioRepository = AppDataSource.getRepository(Funcionario);

export class FuncionarioController {
    static async create(req: Request, res: Response) {
        try {
            const novoFuncionario = funcionarioRepository.create(req.body);
            const resultado = await funcionarioRepository.save(novoFuncionario);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar funcionário", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const funcionarios = await funcionarioRepository.find({ relations: ["empresa", "cargo"] });
            return res.json(funcionarios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionários", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const funcionario = await funcionarioRepository.findOne({
                where: { idFuncionario: id },
                relations: ["empresa", "cargo"]
            });
            if (!funcionario) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }
            return res.json(funcionario);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionário", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const funcionario = await funcionarioRepository.findOneBy({ idFuncionario: id });
            if (!funcionario) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }
            funcionarioRepository.merge(funcionario, req.body);
            const resultado = await funcionarioRepository.save(funcionario);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar funcionário", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await funcionarioRepository.delete(id);
            if (resultado.affected === 0) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar funcionário", error });
        }
    }
}
