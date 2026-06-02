import { object, string, number } from "zod";

export const createItemCompraEpiSchema = object({
    body: object({
        idCompra: string().uuid("ID de compra inválido").optional().nullable(),
        idEpi: string().uuid("ID de EPI inválido").optional().nullable(),
        quantidadeComprada: number({ message: "Quantidade comprada é obrigatória" }),
        precoPraticado: number({ message: "Preço praticado é obrigatório" }),
    })
});

export const updateItemCompraEpiSchema = object({
    body: object({
        idCompra: string().uuid("ID de compra inválido").optional().nullable(),
        idEpi: string().uuid("ID de EPI inválido").optional().nullable(),
        quantidadeComprada: number().optional(),
        precoPraticado: number().optional(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
