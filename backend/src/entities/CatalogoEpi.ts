import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemCompraEpi } from "./ItemCompraEpi";

@Entity("CATALOGO_EPI")
export class CatalogoEpi {
    @PrimaryGeneratedColumn("uuid", { name: "id_epi" })
    idEpi: string;

    @Column({ name: "nome_equipamento", type: "varchar" })
    nomeEquipamento: string;

    @Column({ name: "ca", type: "varchar" })
    ca: string;

    @Column({ name: "descricao_material", type: "text" })
    descricaoMaterial: string;

    @Column({ name: "preco_unitario", type: "float" })
    precoUnitario: number;

    @OneToMany(() => ItemCompraEpi, itemCompraEpi => itemCompraEpi.epi)
    itensCompra: ItemCompraEpi[];
}
