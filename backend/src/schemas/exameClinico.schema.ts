import { object, string } from "zod";

export const createExameClinicoSchema = object({
    body: object({
        nomeExame: string({ message: "Nome do exame é obrigatório" }),
        dataRealizacao: string({ message: "Data de realização é obrigatória" }),
        idAso: string().uuid("ID de ASO inválido").optional().nullable(),
    })
});

export const updateExameClinicoSchema = object({
    body: object({
        nomeExame: string().optional(),
        dataRealizacao: string().optional(),
        idAso: string().uuid("ID de ASO inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
