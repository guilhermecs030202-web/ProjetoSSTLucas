// ============================================================
// 📊 CHARTS.JS — Módulo exclusivo da biblioteca ApexCharts
// ============================================================
// Este arquivo centraliza TODA a lógica de gráficos do dashboard.
// Biblioteca utilizada: ApexCharts (https://apexcharts.com)
// 
// Qualquer configuração, criação ou atualização de gráficos
// deve ser feita exclusivamente neste arquivo.
// ============================================================

import ApexCharts from 'apexcharts';

// ============================================================
// ARMAZENAMENTO DAS INSTÂNCIAS DOS GRÁFICOS
// ============================================================
// Guardamos referências para poder destruir e recriar ao navegar
let chartInstances = {
  acidentesMes: null,
  pendenciasEmpresa: null,
  statusEmpresas: null,
  pendenciasTipo: null
};

// ============================================================
// TEMA GLOBAL — Paleta de cores padrão dos gráficos
// ============================================================
const CHART_COLORS = {
  indigo: '#6366f1',
  indigoLight: '#a5b4fc',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  slateLighter: '#94a3b8',
  slateLight: '#e2e8f0',
  white: '#ffffff',
  background: '#f8fafc'
};

// ============================================================
// CONFIGURAÇÃO BASE — Opções padrão compartilhadas
// ============================================================
const BASE_CHART_OPTIONS = {
  chart: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: { enabled: true, delay: 150 },
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  },
  states: {
    hover: { filter: { type: 'darken', value: 0.9 } },
    active: { filter: { type: 'darken', value: 0.85 } }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    padding: { left: 8, right: 8 }
  }
};

// ============================================================
// 1. GRÁFICO: Acidentes por Mês (Barras verticais)
// ============================================================
const createAcidentesMesChart = (containerId, data) => {
  const options = {
    ...BASE_CHART_OPTIONS,
    chart: {
      ...BASE_CHART_OPTIONS.chart,
      type: 'bar',
      height: 200,
      sparkline: { enabled: false }
    },
    series: [{
      name: 'Acidentes',
      data: data.map(item => item.val)
    }],
    xaxis: {
      categories: data.map(item => item.mes),
      labels: {
        style: {
          colors: CHART_COLORS.slateLighter,
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: false
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '55%',
        distributed: false,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '11px',
        fontWeight: 700,
        colors: [CHART_COLORS.slate]
      },
      background: { enabled: false }
    },
    colors: [CHART_COLORS.indigo],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: [CHART_COLORS.indigoLight],
        stops: [0, 100]
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} acidente${val !== 1 ? 's' : ''}`
      }
    },
    grid: {
      ...BASE_CHART_OPTIONS.grid,
      show: false
    }
  };

  return new ApexCharts(document.querySelector(`#${containerId}`), options);
};

// ============================================================
// 2. GRÁFICO: Empresas com Mais Pendências (Barras horizontais)
// ============================================================
const createPendenciasEmpresaChart = (containerId, data) => {
  const options = {
    ...BASE_CHART_OPTIONS,
    chart: {
      ...BASE_CHART_OPTIONS.chart,
      type: 'bar',
      height: 200
    },
    series: [{
      name: 'Pendências',
      data: data.map(item => item.val)
    }],
    xaxis: {
      categories: data.map(item => item.nome),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: CHART_COLORS.slateLighter,
          fontSize: '11px',
          fontWeight: 600
        },
        maxWidth: 120
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: '60%',
        distributed: true,
        dataLabels: { position: 'bottom' }
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      offsetX: 5,
      style: {
        fontSize: '11px',
        fontWeight: 700,
        colors: [CHART_COLORS.white]
      },
      formatter: (val) => `${val}`,
      background: { enabled: false }
    },
    colors: [
      CHART_COLORS.indigo,
      '#818cf8',
      '#a5b4fc',
      '#c7d2fe',
      '#ddd6fe'
    ],
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} pendência${val !== 1 ? 's' : ''}`
      }
    },
    grid: {
      ...BASE_CHART_OPTIONS.grid,
      show: false
    }
  };

  return new ApexCharts(document.querySelector(`#${containerId}`), options);
};

// ============================================================
// 3. GRÁFICO: Status das Empresas (Donut)
// ============================================================
const createStatusEmpresasChart = (containerId, statusData) => {
  const total = statusData.regular + statusData.atencao + statusData.critico;

  const options = {
    ...BASE_CHART_OPTIONS,
    chart: {
      ...BASE_CHART_OPTIONS.chart,
      type: 'donut',
      height: 220
    },
    series: [statusData.regular, statusData.atencao, statusData.critico],
    labels: ['Regular', 'Atenção', 'Crítico'],
    colors: [CHART_COLORS.emerald, CHART_COLORS.amber, CHART_COLORS.red],
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '13px',
              fontWeight: 700,
              color: CHART_COLORS.slate,
              offsetY: -8
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 800,
              color: '#1e293b',
              offsetY: 4,
              formatter: (val) => val
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              fontWeight: 600,
              color: CHART_COLORS.slateLighter,
              formatter: () => total
            }
          }
        },
        expandOnClick: false
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      colors: [CHART_COLORS.white]
    },
    legend: {
      position: 'right',
      offsetY: 0,
      fontSize: '12px',
      fontWeight: 600,
      labels: { colors: CHART_COLORS.slate },
      markers: {
        width: 10,
        height: 10,
        radius: 12,
        offsetX: -4
      },
      itemMargin: { vertical: 4 },
      formatter: (seriesName, opts) => {
        const val = opts.w.globals.series[opts.seriesIndex];
        const pct = Math.round(val / total * 100);
        return `${seriesName} — ${val} (${pct}%)`;
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => {
          const pct = Math.round(val / total * 100);
          return `${val} empresa${val !== 1 ? 's' : ''} (${pct}%)`;
        }
      }
    }
  };

  return new ApexCharts(document.querySelector(`#${containerId}`), options);
};

// ============================================================
// 4. GRÁFICO: Pendências por Tipo (Barras horizontais agrupadas)
// ============================================================
const createPendenciasTipoChart = (containerId, data, totalPendencias) => {
  const options = {
    ...BASE_CHART_OPTIONS,
    chart: {
      ...BASE_CHART_OPTIONS.chart,
      type: 'bar',
      height: 180,
      stacked: true,
      stackType: '100%'
    },
    series: data.map(item => ({
      name: item.tipo,
      data: [item.val]
    })),
    xaxis: {
      categories: ['Pendências'],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { show: false },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '45%'
      }
    },
    colors: [CHART_COLORS.indigo, CHART_COLORS.emerald, CHART_COLORS.amber],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontWeight: 700
      },
      formatter: (val, opts) => {
        const realVal = opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex];
        return realVal > 0 ? `${realVal}` : '';
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 600,
      labels: { colors: CHART_COLORS.slate },
      markers: {
        width: 10,
        height: 10,
        radius: 12,
        offsetX: -4
      },
      itemMargin: { horizontal: 12 },
      formatter: (seriesName, opts) => {
        const val = opts.w.globals.series[opts.seriesIndex][0];
        const pct = totalPendencias > 0 ? Math.round(val / totalPendencias * 100) : 0;
        return `${seriesName}: ${val} (${pct}%)`;
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} pendência${val !== 1 ? 's' : ''}`
      }
    },
    grid: {
      ...BASE_CHART_OPTIONS.grid,
      show: false
    },
    stroke: {
      width: 2,
      colors: [CHART_COLORS.white]
    }
  };

  return new ApexCharts(document.querySelector(`#${containerId}`), options);
};

// ============================================================
// FUNÇÃO PRINCIPAL — Inicializar todos os gráficos do dashboard
// ============================================================
// Chamada pelo dashboard.js após o HTML ser injetado no DOM.
// Recebe o appState para extrair os dados necessários.
// ============================================================
export const initDashboardCharts = (appState) => {
  // Destruir instâncias anteriores para evitar duplicação
  destroyAllCharts();

  // Pequeno delay para garantir que o DOM já foi pintado
  setTimeout(() => {
    // 1. Acidentes por Mês
    if (document.querySelector('#chart-acidentes-mes')) {
      chartInstances.acidentesMes = createAcidentesMesChart(
        'chart-acidentes-mes',
        appState.acidentesMes
      );
      chartInstances.acidentesMes.render();
    }

    // 2. Empresas com Mais Pendências
    if (document.querySelector('#chart-pendencias-empresa')) {
      chartInstances.pendenciasEmpresa = createPendenciasEmpresaChart(
        'chart-pendencias-empresa',
        appState.rankPend
      );
      chartInstances.pendenciasEmpresa.render();
    }

    // 3. Status das Empresas (Donut)
    if (document.querySelector('#chart-status-empresas')) {
      chartInstances.statusEmpresas = createStatusEmpresasChart(
        'chart-status-empresas',
        appState.statusEmp
      );
      chartInstances.statusEmpresas.render();
    }

    // 4. Pendências por Tipo
    if (document.querySelector('#chart-pendencias-tipo')) {
      chartInstances.pendenciasTipo = createPendenciasTipoChart(
        'chart-pendencias-tipo',
        appState.pendTipo,
        appState.stats.pendencias
      );
      chartInstances.pendenciasTipo.render();
    }
  }, 50);
};

// ============================================================
// FUNÇÃO DE LIMPEZA — Destruir todos os gráficos
// ============================================================
// Deve ser chamada antes de re-renderizar o dashboard ou ao
// navegar para outra página, evitando memory leaks.
// ============================================================
export const destroyAllCharts = () => {
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      chartInstances[key] = null;
    }
  });
};

// ============================================================
// FUNÇÃO DE ATUALIZAÇÃO — Atualizar dados de um gráfico específico
// ============================================================
// Útil para atualizar um gráfico sem destruir e recriar todos.
// ============================================================
export const updateChart = (chartName, newData) => {
  if (chartInstances[chartName]) {
    chartInstances[chartName].updateSeries(newData);
  }
};
