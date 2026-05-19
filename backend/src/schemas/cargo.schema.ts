import { object, string } from "zod";

export const createCargoSchema = object({
    body: object({
        nomeCargo: string({ required_error: "Nome do cargo é obrigatório" }),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    })
});

export const updateCargoSchema = object({
    body: object({
        nomeCargo: string().optional(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
