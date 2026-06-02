import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ItemCompraEpi } from "../entities/ItemCompraEpi";

const itemCompraEpiRepository = AppDataSource.getRepository(ItemCompraEpi);

export class ItemCompraEpiController {
    static async create(req: Request, res: Response) {
        try {
            const novo = itemCompraEpiRepository.create(req.body);
            const resultado = await itemCompraEpiRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Item de Compra", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const itens = await itemCompraEpiRepository.find({ relations: ["compra", "epi"] });
            return res.json(itens);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar itens de compra", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const item = await itemCompraEpiRepository.findOne({ where: { idItemCompra: id }, relations: ["compra", "epi"] });
            if (!item) return res.status(404).json({ message: "Item não encontrado" });
            return res.json(item);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar item", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const item = await itemCompraEpiRepository.findOneBy({ idItemCompra: id });
            if (!item) return res.status(404).json({ message: "Item não encontrado" });
            itemCompraEpiRepository.merge(item, req.body);
            const resultado = await itemCompraEpiRepository.save(item);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar item", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await itemCompraEpiRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Item não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar item", error });
        }
    }
}
