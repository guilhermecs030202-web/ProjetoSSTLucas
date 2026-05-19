import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Empresa } from "./Empresa";
import { Cargo } from "./Cargo";
import { Treinamento } from "./Treinamento";
import { AsoAtestado } from "./AsoAtestado";
import { AcidenteTrabalho } from "./AcidenteTrabalho";

@Entity("FUNCIONARIO")
export class Funcionario {
    @PrimaryGeneratedColumn("uuid", { name: "id_funcionario" })
    idFuncionario: string;

    @Column({ name: "matricula", type: "varchar" })
    matricula: string;

    @Column({ name: "nome_completo", type: "varchar" })
    nomeCompleto: string;

    @Column({ name: "cpf", type: "varchar" })
    cpf: string;

    @Column({ name: "data_admissao", type: "date" })
    dataAdmissao: Date;

    @Column({ name: "data_nascimento", type: "date" })
    dataNascimento: Date;

    @Column({ name: "id_empresa", type: "varchar", nullable: true })
    idEmpresa: string;

    @ManyToOne(() => Empresa, empresa => empresa.funcionarios)
    @JoinColumn({ name: "id_empresa" })
    empresa: Empresa;

    @Column({ name: "id_cargo", type: "varchar", nullable: true })
    idCargo: string;

    @ManyToOne(() => Cargo, cargo => cargo.funcionarios)
    @JoinColumn({ name: "id_cargo" })
    cargo: Cargo;

    @OneToMany(() => Treinamento, treinamento => treinamento.funcionario)
    treinamentos: Treinamento[];

    @OneToMany(() => AsoAtestado, asoAtestado => asoAtestado.funcionario)
    asos: AsoAtestado[];

    @OneToMany(() => AcidenteTrabalho, acidente => acidente.funcionario)
    acidentes: AcidenteTrabalho[];
}
