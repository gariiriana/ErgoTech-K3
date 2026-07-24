/**
 * chartGenerator.ts
 * Generates a proper vertical bar chart as a PNG image (Uint8Array)
 * using an offscreen HTML Canvas element.
 * Used for embedding real bar chart images inside Word (.docx) exports.
 */

export interface BarChartData {
  label: string;
  value: number;
  color: string;
}

export interface BarChartOptions {
  title: string;
  yAxisLabel?: string;
  maxValue: number;
  width?: number;
  height?: number;
  data: BarChartData[];
  showCutoffLine?: boolean;
  cutoffValue?: number;
  cutoffLabel?: string;
}

/**
 * Generates a vertical bar chart as PNG Uint8Array.
 */
export const generateBarChartImage = (options: BarChartOptions): Uint8Array => {
  const {
    title,
    yAxisLabel,
    maxValue,
    width = 520,
    height = 320,
    data,
    showCutoffLine = false,
    cutoffValue = 0,
    cutoffLabel = ''
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Layout constants
  const paddingTop = 48;
  const paddingBottom = 55;
  const paddingLeft = 60;
  const paddingRight = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Title
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 24);

  // Y-axis gridlines and labels
  const ySteps = 5;
  ctx.textAlign = 'right';
  ctx.font = '11px "Segoe UI", Arial, sans-serif';
  for (let i = 0; i <= ySteps; i++) {
    const val = (maxValue / ySteps) * i;
    const y = paddingTop + chartHeight - (i / ySteps) * chartHeight;

    // Gridline
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(paddingLeft + chartWidth, y);
    ctx.stroke();

    // Y-axis label
    ctx.fillStyle = '#64748B';
    ctx.fillText(val % 1 === 0 ? val.toFixed(0) : val.toFixed(1), paddingLeft - 8, y + 4);
  }

  // Y-axis title (rotated)
  if (yAxisLabel) {
    ctx.save();
    ctx.translate(14, paddingTop + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#475569';
    ctx.font = '11px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();
  }

  // X-axis line
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop + chartHeight);
  ctx.lineTo(paddingLeft + chartWidth, paddingTop + chartHeight);
  ctx.stroke();

  // Y-axis line
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartHeight);
  ctx.stroke();

  // Bars
  const barCount = data.length;
  const groupWidth = chartWidth / barCount;
  const barWidth = Math.min(groupWidth * 0.55, 65);
  const barGap = (groupWidth - barWidth) / 2;

  data.forEach((item, i) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = paddingLeft + i * groupWidth + barGap;
    const y = paddingTop + chartHeight - barHeight;

    // Bar shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(x + 3, y + 3, barWidth, barHeight - 3);

    // Bar fill with gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, item.color);
    gradient.addColorStop(1, adjustColor(item.color, -25));
    ctx.fillStyle = gradient;

    // Rounded top corners
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + barHeight);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
    ctx.lineTo(x + barWidth, y + barHeight);
    ctx.closePath();
    ctx.fill();

    // Bar outline
    ctx.strokeStyle = adjustColor(item.color, -40);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Data label on top
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    const displayVal = item.value % 1 === 0 ? item.value.toFixed(0) : item.value.toFixed(2);
    ctx.fillText(displayVal, x + barWidth / 2, y - 6);

    // X-axis label
    ctx.fillStyle = '#475569';
    ctx.font = '10px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    // Wrap long labels
    const words = item.label.split(' ');
    if (words.length > 1 && item.label.length > 10) {
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      ctx.fillText(line1, x + barWidth / 2, paddingTop + chartHeight + 16);
      ctx.fillText(line2, x + barWidth / 2, paddingTop + chartHeight + 28);
    } else {
      ctx.fillText(item.label, x + barWidth / 2, paddingTop + chartHeight + 18);
    }
  });

  // Cutoff / benchmark line
  if (showCutoffLine && cutoffValue > 0) {
    const cutoffY = paddingTop + chartHeight - (cutoffValue / maxValue) * chartHeight;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, cutoffY);
    ctx.lineTo(paddingLeft + chartWidth, cutoffY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cutoff label
    if (cutoffLabel) {
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 9px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(cutoffLabel, paddingLeft + chartWidth - 4, cutoffY - 5);
    }
  }

  // Convert canvas to PNG Uint8Array
  const dataUrl = canvas.toDataURL('image/png');
  const base64 = dataUrl.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

/**
 * Darken or lighten a hex color.
 */
function adjustColor(hex: string, amount: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  const num = parseInt(color, 16);
  let r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
