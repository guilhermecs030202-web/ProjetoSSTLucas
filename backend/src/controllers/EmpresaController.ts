import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Empresa } from "../entities/Empresa";

const empresaRepository = AppDataSource.getRepository(Empresa);

export class EmpresaController {
    static async create(req: Request, res: Response) {
        try {
            const novaEmpresa = empresaRepository.create(req.body);
            const resultado = await empresaRepository.save(novaEmpresa);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar empresa", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const empresas = await empresaRepository.find();
            return res.json(empresas);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar empresas", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const empresa = await empresaRepository.findOneBy({ idEmpresa: id });
            if (!empresa) {
                return res.status(404).json({ message: "Empresa não encontrada" });
            }
            return res.json(empresa);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar empresa", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const empresa = await empresaRepository.findOneBy({ idEmpresa: id });
            if (!empresa) {
                return res.status(404).json({ message: "Empresa não encontrada" });
            }
            empresaRepository.merge(empresa, req.body);
            const resultado = await empresaRepository.save(empresa);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar empresa", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resultado = await empresaRepository.delete(id);
            if (resultado.affected === 0) {
                return res.status(404).json({ message: "Empresa não encontrada" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar empresa", error });
        }
    }
}
