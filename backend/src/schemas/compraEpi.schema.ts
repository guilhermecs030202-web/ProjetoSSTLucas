import { object, string, number } from "zod";

export const createCompraEpiSchema = object({
    body: object({
        dataCompra: string({ required_error: "Data da compra é obrigatória" }),
        valorTotalCompra: number({ required_error: "Valor total é obrigatório" }),
    })
});

export const updateCompraEpiSchema = object({
    body: object({
        dataCompra: string().optional(),
        valorTotalCompra: number().optional(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
