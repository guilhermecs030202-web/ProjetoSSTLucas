export const renderTableSkeleton = (title, subtitle, cols = 5, rows = 5) => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <div class="h-8 bg-slate-200 animate-pulse rounded w-64 mb-2"></div>
          <div class="h-4 bg-slate-200 animate-pulse rounded w-96"></div>
        </div>
        <div class="h-10 w-40 bg-slate-200 animate-pulse rounded-xl"></div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <div class="w-full h-10 bg-slate-200 animate-pulse rounded-lg"></div>
          </div>
          <div class="w-24 h-10 bg-slate-200 animate-pulse rounded-lg"></div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              ${Array(cols).fill(0).map(() => `<th class="px-6 py-4"><div class="h-4 bg-slate-200 animate-pulse rounded w-24"></div></th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${Array(rows).fill(0).map(() => `
              <tr class="animate-pulse bg-slate-50/20">
                ${Array(cols).fill(0).map((_, i) => `<td class="px-6 py-4"><div class="h-5 bg-slate-200 rounded ${i === cols - 1 ? 'w-16 ml-auto' : 'w-full'}"></div></td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};
