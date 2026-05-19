import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CompraEpi } from "./CompraEpi";
import { CatalogoEpi } from "./CatalogoEpi";
import { DistribuicaoEpi } from "./DistribuicaoEpi";

@Entity("ITEM_COMPRA_EPI")
export class ItemCompraEpi {
    @PrimaryGeneratedColumn("uuid", { name: "id_item_compra" })
    idItemCompra: string;

    @Column({ name: "id_compra", type: "varchar", nullable: true })
    idCompra: string;

    @ManyToOne(() => CompraEpi, compra => compra.itensCompra)
    @JoinColumn({ name: "id_compra" })
    compra: CompraEpi;

    @Column({ name: "id_epi", type: "varchar", nullable: true })
    idEpi: string;

    @ManyToOne(() => CatalogoEpi, epi => epi.itensCompra)
    @JoinColumn({ name: "id_epi" })
    epi: CatalogoEpi;

    @Column({ name: "quantidade_comprada", type: "int" })
    quantidadeComprada: number;

    @Column({ name: "preco_praticado", type: "float" })
    precoPraticado: number;

    @OneToMany(() => DistribuicaoEpi, distribuicaoEpi => distribuicaoEpi.itemCompra)
    distribuicoes: DistribuicaoEpi[];
}
