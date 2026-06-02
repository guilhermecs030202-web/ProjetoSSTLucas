import { object, string } from "zod";

export const createEmpresaSchema = object({
    body: object({
        razaoSocial: string({
            message: "Razão Social é obrigatória",
        }),
        cnpj: string({
            message: "CNPJ é obrigatório",
        }).length(14, "CNPJ deve ter 14 caracteres (apenas números)"),
        setor: string().optional().nullable(),
        status: string().optional().nullable(),
        dataCriacao: string().optional().nullable(),
    })
});

export const updateEmpresaSchema = object({
    body: object({
        razaoSocial: string().optional(),
        cnpj: string().length(14, "CNPJ deve ter 14 caracteres (apenas números)").optional(),
        setor: string().optional().nullable(),
        status: string().optional().nullable(),
        dataCriacao: string().optional().nullable(),
    }),
    params: object({
        id: string({
            message: "ID da empresa é obrigatório",
        }).uuid("ID inválido")
    })
});
