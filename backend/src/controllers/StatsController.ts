import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";

export class StatsController {
    static async getStats(req: Request, res: Response) {
        try {
            // ===== 2. KPIs — Contagens reais =====
            const empresasCount = await AppDataSource.query(`SELECT COUNT(*) as count FROM EMPRESA`);
            const funcionariosCount = await AppDataSource.query(`SELECT COUNT(*) as count FROM FUNCIONARIO`);

            // ===== 3. Pendências reais (Vencido + Vencendo) =====
            const docsPendRaw = await AppDataSource.query(`SELECT COUNT(*) as count FROM DOCUMENTO_SST WHERE DATEDIFF(data_validade, CURDATE()) <= 30 OR data_validade IS NULL`);
            const docsPend = parseInt(docsPendRaw[0].count);

            const treinPendRaw = await AppDataSource.query(`SELECT COUNT(*) as count FROM TREINAMENTO WHERE DATEDIFF(data_validade, CURDATE()) <= 30 OR data_validade IS NULL`);
            const treinPend = parseInt(treinPendRaw[0].count);

            const asosPendRaw = await AppDataSource.query(`SELECT COUNT(*) as count FROM ASO_ATESTADO WHERE DATEDIFF(data_validade, CURDATE()) <= 30 OR data_validade IS NULL`);
            const asosPend = parseInt(asosPendRaw[0].count);

            const pendencias = docsPend + treinPend + asosPend;

            // ===== 4. Pendências por Tipo =====
            const pendTipo = [
                { tipo: 'Documentos', val: docsPend, pct: Math.round((docsPend / (pendencias || 1)) * 100), cor: 'bg-indigo-500' },
                { tipo: 'ASOs', val: asosPend, pct: Math.round((asosPend / (pendencias || 1)) * 100), cor: 'bg-emerald-500' },
                { tipo: 'Treinamentos', val: treinPend, pct: Math.round((treinPend / (pendencias || 1)) * 100), cor: 'bg-amber-500' }
            ];

            // ===== 5. Acidentes no mês atual =====
            const acidentesMesRaw = await AppDataSource.query(`SELECT COUNT(*) as count FROM ACIDENTE_TRABALHO WHERE MONTH(data_acidente) = MONTH(CURDATE()) AND YEAR(data_acidente) = YEAR(CURDATE())`);
            const acidentesMes = parseInt(acidentesMesRaw[0].count);

            // ===== 6. Gráfico: Acidentes por Mês (últimos 6 meses) =====
            const acidentesPorMesRaw = await AppDataSource.query(`
                SELECT 
                    MONTH(data_acidente) as m,
                    YEAR(data_acidente) as y,
                    COUNT(*) as count
                FROM ACIDENTE_TRABALHO
                WHERE data_acidente >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
                GROUP BY YEAR(data_acidente), MONTH(data_acidente)
            `);
            
            const mesesNome = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const acidentesMesChart = [];
            const hoje = new Date();
            let mesAtual = hoje.getMonth();
            let anoAtual = hoje.getFullYear();
            
            for (let i = 5; i >= 0; i--) {
                const d = new Date(anoAtual, mesAtual - i, 1);
                const m = d.getMonth();
                const a = d.getFullYear();
                
                const found = acidentesPorMesRaw.find((x: any) => parseInt(x.m) === (m + 1) && parseInt(x.y) === a);
                acidentesMesChart.push({ mes: mesesNome[m], val: found ? parseInt(found.count) : 0 });
            }

            // ===== 7. Ranking: Empresas com mais pendências (Top 5) =====
            const docsPorEmp = await AppDataSource.query(`
                SELECT e.razao_social, COUNT(d.id_documento) as count 
                FROM DOCUMENTO_SST d
                JOIN EMPRESA e ON d.id_empresa = e.id_empresa
                WHERE DATEDIFF(d.data_validade, CURDATE()) <= 30 OR d.data_validade IS NULL
                GROUP BY e.razao_social
            `);

            const asosPorEmp = await AppDataSource.query(`
                SELECT e.razao_social, COUNT(a.id_aso) as count
                FROM ASO_ATESTADO a
                JOIN FUNCIONARIO f ON a.id_funcionario = f.id_funcionario
                JOIN EMPRESA e ON f.id_empresa = e.id_empresa
                WHERE DATEDIFF(a.data_validade, CURDATE()) <= 30 OR a.data_validade IS NULL
                GROUP BY e.razao_social
            `);

            const treinPorEmp = await AppDataSource.query(`
                SELECT e.razao_social, COUNT(t.id_treinamento) as count
                FROM TREINAMENTO t
                JOIN FUNCIONARIO f ON t.id_funcionario = f.id_funcionario
                JOIN EMPRESA e ON f.id_empresa = e.id_empresa
                WHERE DATEDIFF(t.data_validade, CURDATE()) <= 30 OR t.data_validade IS NULL
                GROUP BY e.razao_social
            `);

            const pendPorEmpresa: { [key: string]: number } = {};
            
            const addPend = (arr: any[]) => {
                for (const item of arr) {
                    pendPorEmpresa[item.razao_social] = (pendPorEmpresa[item.razao_social] || 0) + parseInt(item.count);
                }
            };
            addPend(docsPorEmp);
            addPend(asosPorEmp);
            addPend(treinPorEmp);

            let rankPend = Object.keys(pendPorEmpresa).map(k => ({
                nome: k,
                val: pendPorEmpresa[k],
                setor: '-' 
            })).sort((a, b) => b.val - a.val).slice(0, 5);

            if (rankPend.length === 0) {
                rankPend = [{ nome: 'Nenhuma pendência', val: 0, setor: '-' }];
            }

            // ===== 8. Status das Empresas (Regular / Atenção / Crítico) =====
            const acidentesRecentesPorEmp = await AppDataSource.query(`
                SELECT e.id_empresa, COUNT(a.id_acidente) as count
                FROM ACIDENTE_TRABALHO a
                JOIN FUNCIONARIO f ON a.id_funcionario = f.id_funcionario
                JOIN EMPRESA e ON f.id_empresa = e.id_empresa
                WHERE a.data_acidente >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
                GROUP BY e.id_empresa
            `);

            const vencidosDocs = await AppDataSource.query(`SELECT id_empresa, COUNT(*) as count FROM DOCUMENTO_SST WHERE DATEDIFF(data_validade, CURDATE()) < 0 GROUP BY id_empresa`);
            const vencidosAsos = await AppDataSource.query(`SELECT f.id_empresa, COUNT(*) as count FROM ASO_ATESTADO a JOIN FUNCIONARIO f ON a.id_funcionario = f.id_funcionario WHERE DATEDIFF(a.data_validade, CURDATE()) < 0 GROUP BY f.id_empresa`);
            const vencidosTrein = await AppDataSource.query(`SELECT f.id_empresa, COUNT(*) as count FROM TREINAMENTO t JOIN FUNCIONARIO f ON t.id_funcionario = f.id_funcionario WHERE DATEDIFF(t.data_validade, CURDATE()) < 0 GROUP BY f.id_empresa`);

            const pendDocsEmp = await AppDataSource.query(`SELECT id_empresa, COUNT(*) as count FROM DOCUMENTO_SST WHERE DATEDIFF(data_validade, CURDATE()) <= 30 GROUP BY id_empresa`);
            const pendAsosEmp = await AppDataSource.query(`SELECT f.id_empresa, COUNT(*) as count FROM ASO_ATESTADO a JOIN FUNCIONARIO f ON a.id_funcionario = f.id_funcionario WHERE DATEDIFF(a.data_validade, CURDATE()) <= 30 GROUP BY f.id_empresa`);
            const pendTreinEmp = await AppDataSource.query(`SELECT f.id_empresa, COUNT(*) as count FROM TREINAMENTO t JOIN FUNCIONARIO f ON t.id_funcionario = f.id_funcionario WHERE DATEDIFF(t.data_validade, CURDATE()) <= 30 GROUP BY f.id_empresa`);

            const empresas = await AppDataSource.query(`SELECT id_empresa FROM EMPRESA`);
            let regular = 0, atencao = 0, critico = 0;

            const mapByEmp = (arr: any[]) => arr.reduce((acc, curr) => ({ ...acc, [curr.id_empresa]: parseInt(curr.count) }), {});
            
            const mapAcid = mapByEmp(acidentesRecentesPorEmp);
            const mapVencDocs = mapByEmp(vencidosDocs);
            const mapVencAsos = mapByEmp(vencidosAsos);
            const mapVencTrein = mapByEmp(vencidosTrein);
            const mapPendDocs = mapByEmp(pendDocsEmp);
            const mapPendAsos = mapByEmp(pendAsosEmp);
            const mapPendTrein = mapByEmp(pendTreinEmp);

            for (const emp of empresas) {
                const id = emp.id_empresa;
                const acidCount = mapAcid[id] || 0;
                const vencCount = (mapVencDocs[id] || 0) + (mapVencAsos[id] || 0) + (mapVencTrein[id] || 0);
                const pendCount = (mapPendDocs[id] || 0) + (mapPendAsos[id] || 0) + (mapPendTrein[id] || 0);

                if (vencCount > 0 || acidCount >= 2) {
                    critico++;
                } else if (pendCount > 0 || acidCount >= 1) {
                    atencao++;
                } else {
                    regular++;
                }
            }

            if (regular === 0 && atencao === 0 && critico === 0) regular = 1;
            const statusEmp = { regular, atencao, critico };

            // ===== 9. Alertas Prioritários =====
            const formatData = (d: string) => {
                return d || '-';
            };

            const alertasDocs = await AppDataSource.query(`
                SELECT e.razao_social, d.tipo_documento, DATE_FORMAT(d.data_validade, '%d/%m/%Y') as data_formatada, DATEDIFF(d.data_validade, CURDATE()) as diff
                FROM DOCUMENTO_SST d
                JOIN EMPRESA e ON d.id_empresa = e.id_empresa
                WHERE DATEDIFF(d.data_validade, CURDATE()) <= 30 OR d.data_validade IS NULL
            `);

            const alertasAsos = await AppDataSource.query(`
                SELECT f.nome_completo, a.tipo_exame, DATE_FORMAT(a.data_validade, '%d/%m/%Y') as data_formatada, DATEDIFF(a.data_validade, CURDATE()) as diff
                FROM ASO_ATESTADO a
                JOIN FUNCIONARIO f ON a.id_funcionario = f.id_funcionario
                WHERE DATEDIFF(a.data_validade, CURDATE()) <= 30 OR a.data_validade IS NULL
            `);

            const alertasTrein = await AppDataSource.query(`
                SELECT f.nome_completo, t.tipo_treinamento, DATE_FORMAT(t.data_validade, '%d/%m/%Y') as data_formatada, DATEDIFF(t.data_validade, CURDATE()) as diff
                FROM TREINAMENTO t
                JOIN FUNCIONARIO f ON t.id_funcionario = f.id_funcionario
                WHERE DATEDIFF(t.data_validade, CURDATE()) <= 30 OR t.data_validade IS NULL
            `);

            const alertas: any[] = [];

            alertasDocs.forEach((d: any) => {
                alertas.push({
                    ent: d.razao_social,
                    desc: `${d.tipo_documento} ${d.diff < 0 ? 'vencido' : 'vencendo em breve'}`,
                    tipo: 'Documento',
                    cor: 'red',
                    data: formatData(d.data_formatada),
                    setor: '-'
                });
            });

            alertasAsos.forEach((a: any) => {
                alertas.push({
                    ent: a.nome_completo,
                    desc: `ASO ${a.tipo_exame} ${a.diff < 0 ? 'vencido' : 'vencendo em breve'}`,
                    tipo: 'ASO',
                    cor: 'emerald',
                    data: formatData(a.data_formatada),
                    setor: '-'
                });
            });

            alertasTrein.forEach((t: any) => {
                alertas.push({
                    ent: t.nome_completo,
                    desc: `${t.tipo_treinamento} ${t.diff < 0 ? 'vencido' : 'vencendo em breve'}`,
                    tipo: 'Treinamento',
                    cor: 'amber',
                    data: formatData(t.data_formatada),
                    setor: '-'
                });
            });

            alertas.sort((a, b) => {
                const parseDate = (str: string) => {
                    if (str === '-') return new Date(9999, 0, 1).getTime();
                    const parts = str.split('/');
                    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
                };
                return parseDate(a.data) - parseDate(b.data);
            });

            res.json({
                stats: {
                    empresas: parseInt(empresasCount[0]?.count || 0),
                    funcionarios: parseInt(funcionariosCount[0]?.count || 0),
                    pendencias,
                    acidentesMes
                },
                pendTipo,
                acidentesMes: acidentesMesChart,
                rankPend,
                statusEmp,
                alertas
            });

        } catch (error) {
            console.error("Erro ao gerar estatísticas:", error);
            res.status(500).json({ error: "Erro ao gerar estatísticas" });
        }
    }
}
