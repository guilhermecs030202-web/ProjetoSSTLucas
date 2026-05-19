import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Empresa } from "./Empresa";

@Entity("MEMBRO_CIPA")
export class MembroCipa {
    @PrimaryGeneratedColumn("uuid", { name: "id_membro" })
    idMembro: string;

    @Column({ name: "nome_membro", type: "varchar" })
    nomeMembro: string;

    @Column({ name: "id_empresa", type: "varchar", nullable: true })
    idEmpresa: string;

    @ManyToOne(() => Empresa, empresa => empresa.membrosCipa)
    @JoinColumn({ name: "id_empresa" })
    empresa: Empresa;
}
