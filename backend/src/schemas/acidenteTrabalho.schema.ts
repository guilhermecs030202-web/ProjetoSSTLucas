import { object, string, boolean } from "zod";

export const createAcidenteTrabalhoSchema = object({
    body: object({
        dataAcidente: string({ message: "Data do acidente é obrigatória" }),
        gravidadeLesao: string().optional().nullable(),
        descricaoEvento: string({ message: "Descrição do evento é obrigatória" }),
        medidasAdotadas: string().optional().nullable(),
        anexoImagem: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
        hora: string().optional().nullable(),
        local: string().optional().nullable(),
        parteCorpo: string().optional().nullable(),
        agente: string().optional().nullable(),
        cid: string().optional().nullable(),
        afastamento: string().optional().nullable(),
        obito: string().optional().nullable(),
        medico: string().optional().nullable(),
        crm: string().optional().nullable(),
        testemunhaNome: string().optional().nullable(),
        testemunhaTelefone: string().optional().nullable(),
        catEmitida: boolean().optional(),
        tipo: string().optional().nullable(),
    })
});

export const updateAcidenteTrabalhoSchema = object({
    body: object({
        dataAcidente: string().optional(),
        gravidadeLesao: string().optional().nullable(),
        descricaoEvento: string().optional(),
        medidasAdotadas: string().optional().nullable(),
        anexoImagem: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
        hora: string().optional().nullable(),
        local: string().optional().nullable(),
        parteCorpo: string().optional().nullable(),
        agente: string().optional().nullable(),
        cid: string().optional().nullable(),
        afastamento: string().optional().nullable(),
        obito: string().optional().nullable(),
        medico: string().optional().nullable(),
        crm: string().optional().nullable(),
        testemunhaNome: string().optional().nullable(),
        testemunhaTelefone: string().optional().nullable(),
        catEmitida: boolean().optional(),
        tipo: string().optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
