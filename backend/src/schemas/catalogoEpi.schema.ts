import { object, string, number } from "zod";

export const createCatalogoEpiSchema = object({
    body: object({
        nomeEquipamento: string({ required_error: "Nome do equipamento é obrigatório" }),
        ca: string({ required_error: "CA é obrigatório" }),
        descricaoMaterial: string({ required_error: "Descrição do material é obrigatória" }),
        precoUnitario: number({ required_error: "Preço unitário é obrigatório" }),
    })
});

export const updateCatalogoEpiSchema = object({
    body: object({
        nomeEquipamento: string().optional(),
        ca: string().optional(),
        descricaoMaterial: string().optional(),
        precoUnitario: number().optional(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
