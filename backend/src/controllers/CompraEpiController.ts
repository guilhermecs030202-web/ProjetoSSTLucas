import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { CompraEpi } from "../entities/CompraEpi";
import { CatalogoEpi } from "../entities/CatalogoEpi";
import { ItemCompraEpi } from "../entities/ItemCompraEpi";
import { DistribuicaoEpi } from "../entities/DistribuicaoEpi";

export class CompraEpiController {
    static async create(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { dataCompra, valorTotalCompra, nf, itens } = req.body;

            // 1. Create and save CompraEpi
            const compra = new CompraEpi();
            compra.dataCompra = new Date(dataCompra);
            compra.valorTotalCompra = valorTotalCompra;
            compra.nf = nf;
            const savedCompra = await queryRunner.manager.save(compra);

            // 2. Process each item
            if (itens && Array.isArray(itens)) {
                for (const item of itens) {
                    // Find or create CatalogoEpi
                    let epi = await queryRunner.manager.findOne(CatalogoEpi, {
                        where: {
                            nomeEquipamento: item.descricao,
                            ca: item.ca || ""
                        }
                    });

                    if (!epi) {
                        epi = new CatalogoEpi();
                        epi.nomeEquipamento = item.descricao;
                        epi.ca = item.ca || "";
                        epi.descricaoMaterial = item.tipo || "EPI";
                        epi.precoUnitario = item.valorUnitario || 0;
                        epi = await queryRunner.manager.save(epi);
                    }

                    // Create ItemCompraEpi
                    const itemCompra = new ItemCompraEpi();
                    itemCompra.idCompra = savedCompra.idCompra;
                    itemCompra.idEpi = epi.idEpi;
                    itemCompra.quantidadeComprada = item.quantidade;
                    itemCompra.precoPraticado = item.valorUnitario;
                    const savedItem = await queryRunner.manager.save(itemCompra);

                    // Create distributions
                    if (item.distribuicoes && Array.isArray(item.distribuicoes)) {
                        for (const dist of item.distribuicoes) {
                            const distribuicao = new DistribuicaoEpi();
                            distribuicao.idItemCompra = savedItem.idItemCompra;
                            distribuicao.idEmpresa = dist.empresaId;
                            distribuicao.quantidadeDestinada = dist.quantidade;
                            await queryRunner.manager.save(distribuicao);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();

            // Fetch fully populated
            const fullySaved = await AppDataSource.getRepository(CompraEpi).findOne({
                where: { idCompra: savedCompra.idCompra },
                relations: [
                    "itensCompra",
                    "itensCompra.epi",
                    "itensCompra.distribuicoes",
                    "itensCompra.distribuicoes.empresa"
                ]
            });

            return res.status(201).json(fullySaved);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao criar Compra de EPI:", error);
            return res.status(500).json({ message: "Erro ao criar Compra de EPI", error });
        } finally {
            await queryRunner.release();
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const compras = await AppDataSource.getRepository(CompraEpi).find({
                relations: [
                    "itensCompra",
                    "itensCompra.epi",
                    "itensCompra.distribuicoes",
                    "itensCompra.distribuicoes.empresa"
                ]
            });
            return res.json(compras);
        } catch (error) {
            console.error("Erro ao buscar compras:", error);
            return res.status(500).json({ message: "Erro ao buscar compras", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params as any;
            const compra = await AppDataSource.getRepository(CompraEpi).findOne({
                where: { idCompra: id },
                relations: [
                    "itensCompra",
                    "itensCompra.epi",
                    "itensCompra.distribuicoes",
                    "itensCompra.distribuicoes.empresa"
                ]
            });
            if (!compra) return res.status(404).json({ message: "Compra não encontrada" });
            return res.json(compra);
        } catch (error) {
            console.error("Erro ao buscar compra:", error);
            return res.status(500).json({ message: "Erro ao buscar compra", error });
        }
    }

    static async update(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { id } = req.params as any;
            const { dataCompra, valorTotalCompra, nf, itens } = req.body;

            const compra = await queryRunner.manager.findOne(CompraEpi, {
                where: { idCompra: id },
                relations: ["itensCompra"]
            });
            if (!compra) {
                return res.status(404).json({ message: "Compra não encontrada" });
            }

            // Update header info
            compra.dataCompra = new Date(dataCompra);
            compra.valorTotalCompra = valorTotalCompra;
            compra.nf = nf;
            await queryRunner.manager.save(compra);

            // Clean up old items and distributions
            for (const item of compra.itensCompra) {
                await queryRunner.manager.delete(DistribuicaoEpi, { idItemCompra: item.idItemCompra });
            }
            await queryRunner.manager.delete(ItemCompraEpi, { idCompra: id });

            // Create new items and distributions
            if (itens && Array.isArray(itens)) {
                for (const item of itens) {
                    let epi = await queryRunner.manager.findOne(CatalogoEpi, {
                        where: {
                            nomeEquipamento: item.descricao,
                            ca: item.ca || ""
                        }
                    });

                    if (!epi) {
                        epi = new CatalogoEpi();
                        epi.nomeEquipamento = item.descricao;
                        epi.ca = item.ca || "";
                        epi.descricaoMaterial = item.tipo || "EPI";
                        epi.precoUnitario = item.valorUnitario || 0;
                        epi = await queryRunner.manager.save(epi);
                    }

                    const itemCompra = new ItemCompraEpi();
                    itemCompra.idCompra = id;
                    itemCompra.idEpi = epi.idEpi;
                    itemCompra.quantidadeComprada = item.quantidade;
                    itemCompra.precoPraticado = item.valorUnitario;
                    const savedItem = await queryRunner.manager.save(itemCompra);

                    if (item.distribuicoes && Array.isArray(item.distribuicoes)) {
                        for (const dist of item.distribuicoes) {
                            const distribuicao = new DistribuicaoEpi();
                            distribuicao.idItemCompra = savedItem.idItemCompra;
                            distribuicao.idEmpresa = dist.empresaId;
                            distribuicao.quantidadeDestinada = dist.quantidade;
                            await queryRunner.manager.save(distribuicao);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();

            const fullyUpdated = await AppDataSource.getRepository(CompraEpi).findOne({
                where: { idCompra: id },
                relations: [
                    "itensCompra",
                    "itensCompra.epi",
                    "itensCompra.distribuicoes",
                    "itensCompra.distribuicoes.empresa"
                ]
            });

            return res.json(fullyUpdated);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao atualizar compra:", error);
            return res.status(500).json({ message: "Erro ao atualizar compra", error });
        } finally {
            await queryRunner.release();
        }
    }

    static async delete(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { id } = req.params as any;
            const compra = await queryRunner.manager.findOne(CompraEpi, {
                where: { idCompra: id },
                relations: ["itensCompra"]
            });
            if (!compra) {
                return res.status(404).json({ message: "Compra não encontrada" });
            }

            // 1. Delete all distributions for all items of this purchase
            for (const item of compra.itensCompra) {
                await queryRunner.manager.delete(DistribuicaoEpi, { idItemCompra: item.idItemCompra });
            }

            // 2. Delete all items of this purchase
            await queryRunner.manager.delete(ItemCompraEpi, { idCompra: id });

            // 3. Delete the purchase itself
            await queryRunner.manager.delete(CompraEpi, { idCompra: id });

            await queryRunner.commitTransaction();
            return res.status(204).send();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao deletar compra:", error);
            return res.status(500).json({ message: "Erro ao deletar compra", error });
        } finally {
            await queryRunner.release();
        }
    }
}
