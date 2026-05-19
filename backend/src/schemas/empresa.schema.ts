import { object, string } from "zod";

export const createEmpresaSchema = object({
    body: object({
        razaoSocial: string({
            required_error: "Razão Social é obrigatória",
        }),
        cnpj: string({
            required_error: "CNPJ é obrigatório",
        }).length(14, "CNPJ deve ter 14 caracteres (apenas números)"),
    })
});

export const updateEmpresaSchema = object({
    body: object({
        razaoSocial: string().optional(),
        cnpj: string().length(14, "CNPJ deve ter 14 caracteres (apenas números)").optional(),
    }),
    params: object({
        id: string({
            required_error: "ID da empresa é obrigatório",
        }).uuid("ID inválido")
    })
});
