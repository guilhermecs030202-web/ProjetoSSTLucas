import { object, string } from "zod";

export const createDocumentoSstSchema = object({
    body: object({
        tipoDocumento: string({ required_error: "Tipo de documento é obrigatório" }),
        dataEmissaoUpload: string({ required_error: "Data de emissão é obrigatória" }),
        dataValidade: string({ required_error: "Data de validade é obrigatória" }),
        statusDocumento: string({ required_error: "Status do documento é obrigatório" }),
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
