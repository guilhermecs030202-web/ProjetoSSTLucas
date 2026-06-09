import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Empresa } from "./Empresa";

@Entity("DOCUMENTO_SST")
export class DocumentoSst {
    @PrimaryGeneratedColumn("uuid", { name: "id_documento" })
    idDocumento: string;

    @Column({ name: "tipo_documento", type: "varchar" })
    tipoDocumento: string;

    @Column({ name: "data_emissao_upload", type: "date" })
    dataEmissaoUpload: Date;

    @Column({ name: "data_validade", type: "date" })
    dataValidade: Date;

    @Column({ name: "status_documento", type: "varchar" })
    statusDocumento: string;

    @Column({ name: "nome_arquivo", type: "varchar", nullable: true })
    nomeArquivo: string;

    @Column({ name: "mime_type", type: "varchar", nullable: true })
    mimeType: string;

    @Column({ name: "tamanho_arquivo", type: "int", nullable: true })
    tamanhoArquivo: number;

    @Column({ name: "caminho_arquivo", type: "varchar", nullable: true })
    caminhoArquivo: string;

    @Column({ name: "id_empresa", type: "varchar", nullable: true })
    idEmpresa: string;

    @ManyToOne(() => Empresa, empresa => empresa.documentosSst)
    @JoinColumn({ name: "id_empresa" })
    empresa: Empresa;
}
