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

    @Column({ name: "hora", type: "varchar", nullable: true })
    hora: string;

    @Column({ name: "local", type: "varchar", nullable: true })
    local: string;

    @Column({ name: "parte_corpo", type: "varchar", nullable: true })
    parteCorpo: string;

    @Column({ name: "agente", type: "varchar", nullable: true })
    agente: string;

    @Column({ name: "cid", type: "varchar", nullable: true })
    cid: string;

    @Column({ name: "afastamento", type: "varchar", nullable: true })
    afastamento: string;

    @Column({ name: "obito", type: "varchar", nullable: true })
    obito: string;

    @Column({ name: "medico", type: "varchar", nullable: true })
    medico: string;

    @Column({ name: "crm", type: "varchar", nullable: true })
    crm: string;

    @Column({ name: "testemunha_nome", type: "varchar", nullable: true })
    testemunhaNome: string;

    @Column({ name: "testemunha_telefone", type: "varchar", nullable: true })
    testemunhaTelefone: string;

    @Column({ name: "cat_emitida", type: "boolean", default: false })
    catEmitida: boolean;

    @Column({ name: "tipo", type: "varchar", nullable: true })
    tipo: string;

    @Column({ name: "id_funcionario", type: "varchar", nullable: true })
    idFuncionario: string;

    @ManyToOne(() => Funcionario, funcionario => funcionario.acidentes)
    @JoinColumn({ name: "id_funcionario" })
    funcionario: Funcionario;
}
