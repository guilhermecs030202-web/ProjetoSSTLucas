import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn("uuid", { name: "id_usuario" })
    idUsuario: string;

    @Column({ name: "login", type: "varchar", unique: true })
    login: string;

    @Column({ name: "email", type: "varchar", unique: true })
    email: string;

    @Column({ name: "senha", type: "varchar" })
    senha: string;
}
