import { object, string, number } from "zod";

export const createDistribuicaoEpiSchema = object({
    body: object({
        idItemCompra: string().uuid("ID do item de compra inválido").optional().nullable(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
        quantidadeDestinada: number({ required_error: "Quantidade destinada é obrigatória" }),
    })
});

export const updateDistribuicaoEpiSchema = object({
    body: object({
        idItemCompra: string().uuid("ID do item de compra inválido").optional().nullable(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
        quantidadeDestinada: number().optional(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
