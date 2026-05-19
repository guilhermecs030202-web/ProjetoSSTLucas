import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ItemCompraEpi } from "./ItemCompraEpi";
import { Empresa } from "./Empresa";

@Entity("DISTRIBUICAO_EPI")
export class DistribuicaoEpi {
    @PrimaryGeneratedColumn("uuid", { name: "id_distribuicao" })
    idDistribuicao: string;

    @Column({ name: "id_item_compra", type: "varchar", nullable: true })
    idItemCompra: string;

    @ManyToOne(() => ItemCompraEpi, itemCompra => itemCompra.distribuicoes)
    @JoinColumn({ name: "id_item_compra" })
    itemCompra: ItemCompraEpi;

    @Column({ name: "id_empresa", type: "varchar", nullable: true })
    idEmpresa: string;

    @ManyToOne(() => Empresa, empresa => empresa.distribuicoesEpi)
    @JoinColumn({ name: "id_empresa" })
    empresa: Empresa;

    @Column({ name: "quantidade_destinada", type: "int" })
    quantidadeDestinada: number;
}
