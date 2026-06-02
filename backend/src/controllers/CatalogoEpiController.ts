import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { CatalogoEpi } from "../entities/CatalogoEpi";

const catalogoEpiRepository = AppDataSource.getRepository(CatalogoEpi);

export class CatalogoEpiController {
    static async create(req: Request, res: Response) {
        try {
            const novo = catalogoEpiRepository.create(req.body);
            const resultado = await catalogoEpiRepository.save(novo);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar Catálogo EPI", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const catalogos = await catalogoEpiRepository.find();
            return res.json(catalogos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar catálogos", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const catalogo = await catalogoEpiRepository.findOneBy({ idEpi: id });
            if (!catalogo) return res.status(404).json({ message: "Catálogo não encontrado" });
            return res.json(catalogo);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar catálogo", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const catalogo = await catalogoEpiRepository.findOneBy({ idEpi: id });
            if (!catalogo) return res.status(404).json({ message: "Catálogo não encontrado" });
            catalogoEpiRepository.merge(catalogo, req.body);
            const resultado = await catalogoEpiRepository.save(catalogo);
            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar catálogo", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const resultado = await catalogoEpiRepository.delete(id);
            if (resultado.affected === 0) return res.status(404).json({ message: "Catálogo não encontrado" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar catálogo", error });
        }
    }
}
