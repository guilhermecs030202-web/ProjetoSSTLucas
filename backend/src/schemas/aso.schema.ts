import { object, string } from "zod";

export const createAsoSchema = object({
    body: object({
        tipoExame: string({ required_error: "Tipo de exame é obrigatório" }),
        dataExame: string({ required_error: "Data do exame é obrigatória" }),
        dataValidade: string({ required_error: "Data de validade é obrigatória" }),
        statusAptidao: string({ required_error: "Status de aptidão é obrigatório" }),
        riscosOcupacionais: string({ required_error: "Riscos ocupacionais são obrigatórios" }),
        idFuncionario: string({ required_error: "ID do funcionário é obrigatório" }).uuid("ID de funcionário inválido"),
    })
});

export const updateAsoSchema = object({
    body: object({
        tipoExame: string().optional(),
        dataExame: string().optional(),
        dataValidade: string().optional(),
        statusAptidao: string().optional(),
        riscosOcupacionais: string().optional(),
        idFuncionario: string().uuid("ID de funcionário inválido").optional(),
    }),
    params: object({
        id: string({ required_error: "ID do ASO é obrigatório" }).uuid("ID inválido")
    })
});
