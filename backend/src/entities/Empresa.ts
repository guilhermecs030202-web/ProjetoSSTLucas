import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Cargo } from "./Cargo";
import { Funcionario } from "./Funcionario";
import { MembroCipa } from "./MembroCipa";
import { DocumentoSst } from "./DocumentoSst";
import { DistribuicaoEpi } from "./DistribuicaoEpi";

@Entity("EMPRESA")
export class Empresa {
    @PrimaryGeneratedColumn("uuid", { name: "id_empresa" })
    idEmpresa: string;

    @Column({ name: "razao_social", type: "varchar" })
    razaoSocial: string;

    @Column({ name: "cnpj", type: "varchar" })
    cnpj: string;

    @OneToMany(() => Cargo, cargo => cargo.empresa)
    cargos: Cargo[];

    @OneToMany(() => Funcionario, funcionario => funcionario.empresa)
    funcionarios: Funcionario[];

    @OneToMany(() => MembroCipa, membroCipa => membroCipa.empresa)
    membrosCipa: MembroCipa[];

    @OneToMany(() => DocumentoSst, documentoSst => documentoSst.empresa)
    documentosSst: DocumentoSst[];

    @OneToMany(() => DistribuicaoEpi, distribuicaoEpi => distribuicaoEpi.empresa)
    distribuicoesEpi: DistribuicaoEpi[];
}
