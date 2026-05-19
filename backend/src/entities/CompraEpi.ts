import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemCompraEpi } from "./ItemCompraEpi";

@Entity("COMPRA_EPI")
export class CompraEpi {
    @PrimaryGeneratedColumn("uuid", { name: "id_compra" })
    idCompra: string;

    @Column({ name: "data_compra", type: "date" })
    dataCompra: Date;

    @Column({ name: "valor_total_compra", type: "float" })
    valorTotalCompra: number;

    @OneToMany(() => ItemCompraEpi, itemCompraEpi => itemCompraEpi.compra)
    itensCompra: ItemCompraEpi[];
}
