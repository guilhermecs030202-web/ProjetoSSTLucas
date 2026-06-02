import { object, string } from "zod";

export const createMembroCipaSchema = object({
    body: object({
        nomeMembro: string({ message: "Nome do membro é obrigatório" }),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    })
});

export const updateMembroCipaSchema = object({
    body: object({
        nomeMembro: string().optional(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
