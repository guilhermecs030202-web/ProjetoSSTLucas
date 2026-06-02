import { object, string } from "zod";

export const createDocumentoSstSchema = object({
    body: object({
        tipoDocumento: string({ message: "Tipo de documento é obrigatório" }),
        dataEmissaoUpload: string({ message: "Data de emissão é obrigatória" }),
        dataValidade: string({ message: "Data de validade é obrigatória" }),
        statusDocumento: string({ message: "Status do documento é obrigatório" }),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    })
});

export const updateDocumentoSstSchema = object({
    body: object({
        tipoDocumento: string().optional(),
        dataEmissaoUpload: string().optional(),
        dataValidade: string().optional(),
        statusDocumento: string().optional(),
        idEmpresa: string().uuid("ID de empresa inválido").optional().nullable(),
    }),
    params: object({
        id: string().uuid("ID inválido")
    })
});
