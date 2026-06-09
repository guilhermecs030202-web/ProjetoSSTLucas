import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const { email, password } = req.body;

            // Consultar no banco por email ou login
            const user = await usuarioRepository.findOne({
                where: [
                    { email: email },
                    { login: email }
                ]
            });

            if (!user) {
                return res.status(401).json({ message: "E-mail/login ou senha incorretos." });
            }

            // Validar a senha comparando com o hash do banco
            const isPasswordValid = await bcrypt.compare(password, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "E-mail/login ou senha incorretos." });
            }

            // Retornar dados do usuário ocultando a senha
            return res.json({
                message: "Login realizado com sucesso",
                user: {
                    idUsuario: user.idUsuario,
                    login: user.login,
                    email: user.email
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro interno no servidor", error });
        }
    }

    static async changeCredentials(req: Request, res: Response) {
        try {
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const { currentEmail, currentPassword, newEmail, newPassword } = req.body;

            // Localizar usuário pelo e-mail ou login atual
            const user = await usuarioRepository.findOne({
                where: [
                    { email: currentEmail },
                    { login: currentEmail }
                ]
            });

            if (!user) {
                return res.status(400).json({ message: "Atenção: O E-mail ou Senha ATUAL que você informou estão incorretos." });
            }

            // Validar senha atual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.senha);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Atenção: O E-mail ou Senha ATUAL que você informou estão incorretos." });
            }

            // Criptografar nova senha
            const hashedPw = await bcrypt.hash(newPassword, 10);

            // Atualizar e-mail/login e senha
            if (newEmail.includes("@")) {
                user.email = newEmail;
                user.login = newEmail.split("@")[0];
            } else {
                user.email = `${newEmail}@sst.com.br`;
                user.login = newEmail;
            }
            user.senha = hashedPw;

            await usuarioRepository.save(user);

            return res.json({ message: "Credenciais alteradas com sucesso!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao alterar credenciais", error });
        }
    }
}
