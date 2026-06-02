import { object, string } from "zod";

export const createTreinamentoSchema = object({
    body: object({
        tipoTreinamento: string({ message: "Tipo de treinamento é obrigatório" }),
        dataRealizacao: string({ message: "Data de realização é obrigatória" }),
        dataValidade: string({ message: "Data de validade é obrigatória" }),
        statusTreinamento: string({ message: "Status do treinamento é obrigatório" }),
        observacoes: string().optional().nullable(),
        instrutor: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
    })
});

export const updateTreinamentoSchema = object({
    body: object({
        tipoTreinamento: string().optional(),
        dataRealizacao: string().optional(),
        dataValidade: string().optional(),
        statusTreinamento: string().optional(),
        observacoes: string().optional().nullable(),
        instrutor: string().optional().nullable(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
