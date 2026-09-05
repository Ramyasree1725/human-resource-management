/**
 * Vector SVG Geometry & Chart Path Calculation Engine
 * Math algorithms for high-performance chart rendering:
 * - Smooth cubic bezier curve SVG path generators
 * - Polar-to-cartesian donut and pie chart slice path builders
 * - Multi-series grouped and stacked bar layout metrics
 * - Trendline linear regression algorithms.
 */

export class AnalyticsChartBuilders {
  static polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  static describeArc(x, y, radius, startAngle, endAngle) {
    const start = AnalyticsChartBuilders.polarToCartesian(x, y, radius, endAngle);
    const end = AnalyticsChartBuilders.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  }

  static describeDonutSlice(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle) {
    const outerStart = AnalyticsChartBuilders.polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const outerEnd = AnalyticsChartBuilders.polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = AnalyticsChartBuilders.polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const innerEnd = AnalyticsChartBuilders.polarToCartesian(centerX, centerY, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', outerStart.x, outerStart.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  }

  static computeDonutChartData(slices = [], centerX = 100, centerY = 100, innerRadius = 45, outerRadius = 80) {
    const totalValue = slices.reduce((sum, s) => sum + (s.value || 0), 0);
    if (totalValue === 0) return [];

    let currentAngle = 0;

    return slices.map(slice => {
      const sliceAngle = (slice.value / totalValue) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle += sliceAngle;

      const path = AnalyticsChartBuilders.describeDonutSlice(
        centerX,
        centerY,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle > 359.99 ? 359.99 : endAngle
      );

      return {
        ...slice,
        percentage: Number(((slice.value / totalValue) * 100).toFixed(1)),
        startAngle,
        endAngle,
        path
      };
    });
  }

  static generateSmoothLinePath(points = []) {
    if (points.length < 2) return '';

    const formatPoint = (p) => `${p.x},${p.y}`;
    let path = `M ${formatPoint(points[0])}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      // Catmull-Rom to Cubic Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
    }

    return path;
  }

  static calculateLinearRegressionTrendline(dataPoints = []) {
    const n = dataPoints.length;
    if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    dataPoints.forEach((pt, i) => {
      const x = i + 1;
      const y = pt.y || pt.value || pt;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
      sumYY += y * y;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const numerator = (n * sumXY - sumX * sumY);
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const rSquared = denominator !== 0 ? Math.pow(numerator / denominator, 2) : 0;

    return {
      slope: Number(slope.toFixed(3)),
      intercept: Number(intercept.toFixed(3)),
      rSquared: Number(rSquared.toFixed(3)),
      trendDirection: slope > 0.05 ? 'GROWTH' : (slope < -0.05 ? 'DECLINE' : 'STABLE')
    };
  }
}
