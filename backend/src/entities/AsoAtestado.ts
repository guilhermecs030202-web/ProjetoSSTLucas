import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Funcionario } from "./Funcionario";
import { ExameClinico } from "./ExameClinico";

@Entity("ASO_ATESTADO")
export class AsoAtestado {
    @PrimaryGeneratedColumn("uuid", { name: "id_aso" })
    idAso: string;

    @Column({ name: "tipo_exame", type: "varchar" })
    tipoExame: string;

    @Column({ name: "data_exame", type: "date" })
    dataExame: Date;

    @Column({ name: "data_validade", type: "date" })
    dataValidade: Date;

    @Column({ name: "status_aptidao", type: "varchar" })
    statusAptidao: string;

    @Column({ name: "riscos_ocupacionais", type: "varchar" })
    riscosOcupacionais: string;

    @Column({ name: "id_funcionario", type: "varchar", nullable: true })
    idFuncionario: string;

    @ManyToOne(() => Funcionario, funcionario => funcionario.asos)
    @JoinColumn({ name: "id_funcionario" })
    funcionario: Funcionario;

    @OneToMany(() => ExameClinico, exameClinico => exameClinico.aso)
    examesClinicos: ExameClinico[];
}
