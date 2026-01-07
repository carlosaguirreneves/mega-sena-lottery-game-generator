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

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.4);
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

  if (count.veryLow < config.lowRangeConfig.min) return false;

  if (count.midLow + count.mid < 2) return false;
  if (count.midHigh + count.high < 2) return false;

  // Números quentes
  const hotUsed = game.filter(n => hotNumbers.includes(n)).length;
  if (hotUsed < 2 || hotUsed > 3) return false;

  return true;
}

function getRange(n) {
  if (n <= 10) return 'veryLow';   // 1–10
  if (n <= 20) return 'low';       // 11–20
  if (n <= 29) return 'midLow';    // 21–29
  if (n <= 39) return 'mid';       // 30–39
  if (n <= 49) return 'midHigh';   // 40–49
  return 'high';                   // 50–60
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

  const results = new Set();

  while (results.size < maxGames) {
    const game = [
      ...shuffle(byRange.veryLow).slice(0, config.lowRangeConfig.min),
      ...shuffle(byRange.low).slice(0, config.lowRangeConfig.min === 2 ? 0 : 1),
      //...shuffle([...byRange.midLow]).slice(0, 1),
      ...shuffle([...byRange.mid, ...byRange.midHigh]).slice(0, 4)
    ];

    if (game.length !== 6) continue;

    const normalized = [...new Set(game)].sort((a, b) => a - b);
    if (normalized.length !== 6) continue;

    if (validateGame(normalized, hotNumbers, config)) {
      results.add(normalized.join('-'));
    }

    if (results.size > 50) break; // proteção contra loop infinito
  }

  return [...results].map(g => g.split('-').map(Number));
}

module.exports = { generateGames };
