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

    @Column({ name: "observacoes", type: "text", nullable: true })
    observacoes: string;

    @Column({ name: "instrutor", type: "varchar", nullable: true })
    instrutor: string;

    @Column({ name: "id_funcionario", type: "varchar", nullable: true })
    idFuncionario: string;

    @Column({ name: "nome_arquivo", type: "varchar", nullable: true })
    nomeArquivo: string;

    @Column({ name: "mime_type", type: "varchar", nullable: true })
    mimeType: string;

    @Column({ name: "tamanho_arquivo", type: "int", nullable: true })
    tamanhoArquivo: number;

    @Column({ name: "caminho_arquivo", type: "varchar", nullable: true })
    caminhoArquivo: string;

    @ManyToOne(() => Funcionario, funcionario => funcionario.treinamentos)
    @JoinColumn({ name: "id_funcionario" })
    funcionario: Funcionario;
}
