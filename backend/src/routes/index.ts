import { Router } from "express";
import empresaRoutes from "./empresa.routes";
import funcionarioRoutes from "./funcionario.routes";
import asoRoutes from "./aso.routes";
import cargoRoutes from "./cargo.routes";
import membroCipaRoutes from "./membroCipa.routes";
import documentoSstRoutes from "./documentoSst.routes";
import treinamentoRoutes from "./treinamento.routes";
import exameClinicoRoutes from "./exameClinico.routes";
import acidenteTrabalhoRoutes from "./acidenteTrabalho.routes";
import compraEpiRoutes from "./compraEpi.routes";
import catalogoEpiRoutes from "./catalogoEpi.routes";
import itemCompraEpiRoutes from "./itemCompraEpi.routes";
import distribuicaoEpiRoutes from "./distribuicaoEpi.routes";
import statsRoutes from "./stats.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/empresas", empresaRoutes);
router.use("/funcionarios", funcionarioRoutes);
router.use("/asos", asoRoutes);
router.use("/cargos", cargoRoutes);
router.use("/membros-cipa", membroCipaRoutes);
router.use("/documentos-sst", documentoSstRoutes);
router.use("/treinamentos", treinamentoRoutes);
router.use("/exames-clinicos", exameClinicoRoutes);
router.use("/acidentes", acidenteTrabalhoRoutes);
router.use("/compras-epi", compraEpiRoutes);
router.use("/catalogo-epi", catalogoEpiRoutes);
router.use("/itens-compra-epi", itemCompraEpiRoutes);
router.use("/distribuicoes-epi", distribuicaoEpiRoutes);
router.use("/stats", statsRoutes);
router.use("/auth", authRoutes);

export default router;
