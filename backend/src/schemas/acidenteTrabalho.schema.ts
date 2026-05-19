import { object, string } from "zod";

export const createAcidenteTrabalhoSchema = object({
    body: object({
        dataAcidente: string({ required_error: "Data do acidente é obrigatória" }),
        gravidadeLesao: string({ required_error: "Gravidade da lesão é obrigatória" }),
        descricaoEvento: string({ required_error: "Descrição do evento é obrigatória" }),
        medidasAdotadas: string({ required_error: "Medidas adotadas são obrigatórias" }),
        anexoImagem: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
    })
});

export const updateAcidenteTrabalhoSchema = object({
    body: object({
        dataAcidente: string().optional(),
        gravidadeLesao: string().optional(),
        descricaoEvento: string().optional(),
        medidasAdotadas: string().optional(),
        anexoImagem: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
