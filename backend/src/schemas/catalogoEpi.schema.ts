import { object, string, number } from "zod";

export const createCatalogoEpiSchema = object({
    body: object({
        nomeEquipamento: string({ message: "Nome do equipamento é obrigatório" }),
        ca: string({ message: "CA é obrigatório" }),
        descricaoMaterial: string({ message: "Descrição do material é obrigatória" }),
        precoUnitario: number({ message: "Preço unitário é obrigatório" }),
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
