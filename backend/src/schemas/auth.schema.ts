import { object, string } from "zod";

export const loginSchema = object({
    body: object({
        email: string({ message: "E-mail ou login é obrigatório" }),
        password: string({ message: "Senha é obrigatória" }),
    })
});

export const changeCredentialsSchema = object({
    body: object({
        currentEmail: string({ message: "E-mail ou login atual é obrigatório" }),
        currentPassword: string({ message: "Senha atual é obrigatória" }),
        newEmail: string({ message: "Novo e-mail ou login é obrigatório" }),
        newPassword: string({ message: "Nova senha é obrigatória" }),
    })
});
