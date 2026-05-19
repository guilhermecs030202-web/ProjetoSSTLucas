import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Funcionario } from "./Funcionario";

@Entity("ACIDENTE_TRABALHO")
export class AcidenteTrabalho {
    @PrimaryGeneratedColumn("uuid", { name: "id_acidente" })
    idAcidente: string;

    @Column({ name: "data_acidente", type: "date" })
    dataAcidente: Date;

    @Column({ name: "gravidade_lesao", type: "varchar" })
    gravidadeLesao: string;

    @Column({ name: "descricao_evento", type: "text" })
    descricaoEvento: string;

    @Column({ name: "medidas_adotadas", type: "text" })
    medidasAdotadas: string;

    @Column({ name: "anexo_imagem", type: "varchar", nullable: true })
    anexoImagem: string;

    @Column({ name: "id_funcionario", type: "varchar", nullable: true })
    idFuncionario: string;

    @ManyToOne(() => Funcionario, funcionario => funcionario.acidentes)
    @JoinColumn({ name: "id_funcionario" })
    funcionario: Funcionario;
}
