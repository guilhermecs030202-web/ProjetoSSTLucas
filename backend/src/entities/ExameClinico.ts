import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AsoAtestado } from "./AsoAtestado";

@Entity("EXAME_CLINICO")
export class ExameClinico {
    @PrimaryGeneratedColumn("uuid", { name: "id_exame" })
    idExame: string;

    @Column({ name: "nome_exame", type: "varchar" })
    nomeExame: string;

    @Column({ name: "data_realizacao", type: "date" })
    dataRealizacao: Date;

    @Column({ name: "id_aso", type: "varchar", nullable: true })
    idAso: string;

    @ManyToOne(() => AsoAtestado, aso => aso.examesClinicos)
    @JoinColumn({ name: "id_aso" })
    aso: AsoAtestado;
}
