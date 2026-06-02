import { object, string, number } from "zod";

export const createCompraEpiSchema = object({
    body: object({
        dataCompra: string({ message: "Data da compra é obrigatória" }),
        valorTotalCompra: number({ message: "Valor total é obrigatório" }),
        nf: string().optional(),
    })
});

export const updateCompraEpiSchema = object({
    body: object({
        dataCompra: string().optional(),
        valorTotalCompra: number().optional(),
        nf: string().optional(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
