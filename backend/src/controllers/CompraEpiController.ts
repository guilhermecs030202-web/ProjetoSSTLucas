import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { CompraEpi } from "../entities/CompraEpi";

const compraEpiRepository = AppDataSource.getRepository(CompraEpi);

export class CompraEpiController {
    static async create(req: Request, res: Response) {
        try {
            const novo = compraEpiRepository.create(req.body);
            const resultado = await compraEpiRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Compra de EPI", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const compras = await compraEpiRepository.find({ relations: ["itensCompra"] });
            return res.json(compras);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar compras", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const compra = await compraEpiRepository.findOne({ where: { idCompra: id }, relations: ["itensCompra"] });
            if (!compra) return res.status(404).json({ message: "Compra não encontrada" });
            return res.json(compra);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar compra", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const compra = await compraEpiRepository.findOneBy({ idCompra: id });
            if (!compra) return res.status(404).json({ message: "Compra não encontrada" });
            compraEpiRepository.merge(compra, req.body);
            const resultado = await compraEpiRepository.save(compra);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar compra", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resultado = await compraEpiRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Compra não encontrada" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar compra", error });
        }
    }
}
