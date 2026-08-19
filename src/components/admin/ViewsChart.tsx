type Point = { date: string; count: number };

/** Biểu đồ cột lượt xem — SVG nội tuyến, không dùng thư viện ngoài. */
export default function ViewsChart({ data }: { data: Point[] }) {
  const W = 760;
  const H = 240;
  const padX = 8;
  const padTop = 16;
  const padBottom = 28;
  const chartH = H - padTop - padBottom;
  const max = Math.max(1, ...data.map((d) => d.count));
  const slot = (W - padX * 2) / data.length;
  const barW = Math.max(2, slot * 0.62);

  const fmt = (d: string) => {
    const [, m, day] = d.split("-");
    return `${day}/${m}`;
  };

  // Chọn vài mốc ngày để hiển thị nhãn trục X (đầu / giữa / cuối).
  const ticks = new Set([0, Math.floor(data.length / 2), data.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Biểu đồ lượt xem 30 ngày gần đây"
    >
      {/* Đường lưới đỉnh (giá trị lớn nhất) */}
      <line
        x1={padX}
        y1={padTop}
        x2={W - padX}
        y2={padTop}
        stroke="var(--border)"
        strokeDasharray="3 3"
      />
      <text x={padX} y={padTop - 4} fontSize="11" fill="var(--muted-foreground)">
        {max}
      </text>

      {data.map((d, i) => {
        const h = (d.count / max) * chartH;
        const x = padX + i * slot + (slot - barW) / 2;
        const y = padTop + chartH - h;
        return (
          <g key={d.date}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(h, d.count > 0 ? 2 : 0)}
              rx={2}
              fill="var(--primary)"
              opacity={d.count > 0 ? 0.9 : 0.15}
            >
              <title>{`${fmt(d.date)}: ${d.count} lượt xem`}</title>
            </rect>
            {d.count === 0 && (
              <rect
                x={x}
                y={padTop + chartH - 2}
                width={barW}
                height={2}
                rx={1}
                fill="var(--border)"
              />
            )}
            {ticks.has(i) && (
              <text
                x={x + barW / 2}
                y={H - 8}
                fontSize="11"
                textAnchor="middle"
                fill="var(--muted-foreground)"
              >
                {fmt(d.date)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
