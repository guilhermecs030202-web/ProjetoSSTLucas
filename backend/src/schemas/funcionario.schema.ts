import { object, string } from "zod";

export const createFuncionarioSchema = object({
    body: object({
        matricula: string({ required_error: "Matrícula é obrigatória" }),
        nomeCompleto: string({ required_error: "Nome completo é obrigatório" }),
        cpf: string({ required_error: "CPF é obrigatório" }).length(11, "CPF deve ter 11 caracteres (apenas números)"),
        dataAdmissao: string({ required_error: "Data de admissão é obrigatória" }),
        dataNascimento: string({ required_error: "Data de nascimento é obrigatória" }),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
        idCargo: string().uuid("ID de cargo inválido").optional().nullable(),
    })
});

export const updateFuncionarioSchema = object({
    body: object({
        matricula: string().optional(),
        nomeCompleto: string().optional(),
        cpf: string().length(11, "CPF deve ter 11 caracteres (apenas números)").optional(),
        dataAdmissao: string().optional(),
        dataNascimento: string().optional(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
        idCargo: string().uuid("ID de cargo inválido").optional().nullable(),
    }),
    params: object({
        id: string({ required_error: "ID do funcionário é obrigatório" }).uuid("ID inválido")
    })
});
