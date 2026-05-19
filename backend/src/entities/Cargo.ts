import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Empresa } from "./Empresa";
import { Funcionario } from "./Funcionario";

@Entity("CARGO")
export class Cargo {
    @PrimaryGeneratedColumn("uuid", { name: "id_cargo" })
    idCargo: string;

    @Column({ name: "nome_cargo", type: "varchar" })
    nomeCargo: string;

    @Column({ name: "id_empresa", type: "varchar", nullable: true })
    idEmpresa: string;

    @ManyToOne(() => Empresa, empresa => empresa.cargos)
    @JoinColumn({ name: "id_empresa" })
    empresa: Empresa;

    @OneToMany(() => Funcionario, funcionario => funcionario.cargo)
    funcionarios: Funcionario[];
}
