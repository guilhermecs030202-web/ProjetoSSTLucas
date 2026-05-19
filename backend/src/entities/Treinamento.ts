import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Funcionario } from "./Funcionario";

@Entity("TREINAMENTO")
export class Treinamento {
    @PrimaryGeneratedColumn("uuid", { name: "id_treinamento" })
    idTreinamento: string;

    @Column({ name: "tipo_treinamento", type: "varchar" })
    tipoTreinamento: string;

    @Column({ name: "data_realizacao", type: "date" })
    dataRealizacao: Date;

    @Column({ name: "data_validade", type: "date" })
    dataValidade: Date;

    @Column({ name: "status_treinamento", type: "varchar" })
    statusTreinamento: string;

    @Column({ name: "observacoes", type: "varchar", nullable: true })
    observacoes: string;

    @Column({ name: "id_funcionario", type: "varchar", nullable: true })
    idFuncionario: string;

    @ManyToOne(() => Funcionario, funcionario => funcionario.treinamentos)
    @JoinColumn({ name: "id_funcionario" })
    funcionario: Funcionario;
}
