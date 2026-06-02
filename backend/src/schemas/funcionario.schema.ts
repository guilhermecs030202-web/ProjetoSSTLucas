import { object, string } from "zod";

export const createFuncionarioSchema = object({
    body: object({
        matricula: string({ message: "Matrícula é obrigatória" }),
        nomeCompleto: string({ message: "Nome completo é obrigatório" }),
        cpf: string({ message: "CPF é obrigatório" }).length(11, "CPF deve ter 11 caracteres (apenas números)"),
        dataAdmissao: string({ message: "Data de admissão é obrigatória" }),
        dataNascimento: string({ message: "Data de nascimento é obrigatória" }),
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
        id: string({ message: "ID do funcionário é obrigatório" }).uuid("ID inválido")
    })
});
