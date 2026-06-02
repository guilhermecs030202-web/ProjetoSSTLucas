import { object, string } from "zod";

export const createAsoSchema = object({
    body: object({
        tipoExame: string({ message: "Tipo de exame é obrigatório" }),
        dataExame: string({ message: "Data do exame é obrigatória" }),
        dataValidade: string({ message: "Data de validade é obrigatória" }),
        statusAptidao: string({ message: "Status de aptidão é obrigatório" }),
        riscosOcupacionais: string({ message: "Riscos ocupacionais são obrigatórios" }),
        idFuncionario: string({ message: "ID do funcionário é obrigatório" }).uuid("ID de funcionário inválido"),
        observacoes: string().optional().nullable(),
        exames: string().optional().nullable(),
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
        observacoes: string().optional().nullable(),
        exames: string().optional().nullable(),
    }),
    params: object({
        id: string({ message: "ID do ASO é obrigatório" }).uuid("ID inválido")
    })
});
