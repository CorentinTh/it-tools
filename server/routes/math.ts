import { Hono } from 'hono';
import { evaluate } from 'mathjs';

const router = new Hono();

// Math evaluator
router.post('/evaluate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { expression = '' } = body;
  try {
    const result = evaluate(expression);
    return c.json({ result: result?.toString() ?? '' });
  } catch (e: any) {
    return c.json({ error: `Invalid expression: ${e.message}` }, 400);
  }
});

// Percentage calculator
router.post('/percentage', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { type, x, y } = body;

  if (typeof x !== 'number' || typeof y !== 'number') {
    return c.json({ error: 'Provide numeric "x" and "y" fields' }, 400);
  }

  if (type === 'percent-of') {
    // What is x% of y?
    return c.json({ result: (x / 100) * y });
  }

  if (type === 'is-what-percent') {
    // x is what percent of y?
    if (y === 0) return c.json({ error: 'Cannot divide by zero' }, 400);
    return c.json({ result: (100 * x) / y });
  }

  if (type === 'percent-change') {
    // Percentage change from x to y
    if (x === 0) return c.json({ error: 'Cannot divide by zero' }, 400);
    return c.json({ result: ((y - x) / x) * 100 });
  }

  // Default: return all three calculations
  return c.json({
    result: {
      percentOf: (x / 100) * y,
      isWhatPercent: y !== 0 ? (100 * x) / y : null,
      percentChange: x !== 0 ? ((y - x) / x) * 100 : null,
    },
  });
});

export default router;
