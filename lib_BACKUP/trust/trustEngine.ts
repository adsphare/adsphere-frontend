export const trustEngine = {
  calculate(score: {
    success: number;
    total: number;
    disputes: number;
  }) {
    let base = 50;

    base += score.success * 2;
    base -= score.disputes * 10;

    if (score.total > 10) base += 10;

    return Math.max(0, Math.min(100, base));
  },
};





