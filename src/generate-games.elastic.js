/**
 * Versão ELÁSTICA do gerador
 * Permite 1–2 números altos (40–60)
 * Mantém estrutura por ciclos
 */

function analyzeCycle(lastContests) {
  const frequency = new Map();

  lastContests.flat().forEach(n => {
    frequency.set(n, (frequency.get(n) || 0) + 1);
  });

  const hotNumbers = [...frequency.entries()]
    .filter(([_, count]) => count >= 2)
    .map(([num]) => num);

  return { frequency, hotNumbers };
}

function getRange(n) {
  if (n <= 10) return 'veryLow';   // 1–10
  if (n <= 20) return 'low';       // 11–20
  if (n <= 29) return 'midLow';    // 21–29
  if (n <= 39) return 'mid';       // 30–39
  if (n <= 49) return 'midHigh';   // 40–49
  return 'high';                   // 50–60
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function validateGame(game, hotNumbers, config) {
  // Paridade
  const evens = game.filter(n => n % 2 === 0).length;
  if (evens !== 3) return false;

  // Faixas
  const ranges = game.map(getRange);
  const count = {
    veryLow: ranges.filter(r => r === 'veryLow').length,
    low: ranges.filter(r => r === 'low').length,
    midLow: ranges.filter(r => r === 'midLow').length,
    mid: ranges.filter(r => r === 'mid').length,
    midHigh: ranges.filter(r => r === 'midHigh').length,
    high: ranges.filter(r => r === 'high').length
  };

  // 1–10 parametrizado
  if (
    count.veryLow < config.lowRangeConfig.min ||
    count.veryLow > config.lowRangeConfig.max
  ) return false;

  // Núcleo estrutural
  if (count.mid !== 2) return false;

  // AJUSTE FINO AQUI
  const highTotal = count.midHigh + count.high;
  if (highTotal < 1 || highTotal > 2) return false;

  // Controle leve das intermediárias
  if (count.low > 1) return false;
  if (count.midLow > 1) return false;

  // Números quentes
  const hotUsed = game.filter(n => hotNumbers.includes(n)).length;
  if (hotUsed < 2 || hotUsed > 3) return false;

  return true;
}

function generateGames(lastContests, config, maxGames = 3) {
  const { hotNumbers } = analyzeCycle(lastContests);
  const pool = [...new Set(lastContests.flat())];

  const byRange = {
    veryLow: pool.filter(n => getRange(n) === 'veryLow'),
    low: pool.filter(n => getRange(n) === 'low'),
    midLow: pool.filter(n => getRange(n) === 'midLow'),
    mid: pool.filter(n => getRange(n) === 'mid'),
    midHigh: pool.filter(n => getRange(n) === 'midHigh'),
    high: pool.filter(n => getRange(n) === 'high')
  };

  if (byRange.mid.length < 2) {
    throw new Error('Pool insuficiente na faixa 30–39');
  }

  const results = new Set();
  let safety = 0;

  while (results.size < maxGames && safety < 5000) {
    safety++;

    const game = [
      ...shuffle(byRange.veryLow).slice(0, config.lowRangeConfig.min),
      ...shuffle(byRange.low).slice(0, config.lowRangeConfig.min === 2 ? 0 : 1),
      ...shuffle(byRange.midLow).slice(0, 1),
      //...shuffle(byRange.mid).slice(0, 1),
      ...shuffle([...byRange.mid, ...byRange.midHigh, ...byRange.high]).slice(0, 3)
    ];

    const normalized = [...new Set(game)].sort((a, b) => a - b);
    if (normalized.length !== 6) continue;

    if (validateGame(normalized, hotNumbers, config)) {
      results.add(normalized.join('-'));
    }
  }

  return [...results].map(g => g.split('-').map(Number));
}

module.exports = { generateGames };
