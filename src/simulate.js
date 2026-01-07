const { generateGames } = require('./generate-games');

function countHits(game, target) {
  return game.filter(n => target.has(n)).length;
}

function simulate({lastContests, gameTarget, config, bets = 50, attempts = 2000}) {
  let totalGames = 0;

  const quadraResult = [];
  const quinaResult = [];
  const senaResult = [];

  for (let batch = 1; batch <= attempts; batch++) {
    const games = generateGames(lastContests, config, bets);

    for (const game of games) {
      totalGames++;
      const hits = countHits(game, gameTarget);

      if (hits === 4) {
        quadraResult.push({ type: 'QUADRA', games: totalGames });
      }

      if (hits === 5) {
        quinaResult.push({ type: 'QUINA', games: totalGames });
      }

      if (hits === 6) {
        senaResult.push({ type: 'SENA', games: totalGames });
      }
    }
  }

  const results = [];

  if (quadraResult.length > 0) {
    results.push(quadraResult[0])
  }

  if (quinaResult.length > 0) {
    results.push(quinaResult[0])
  }

  if (senaResult.length > 0) {
    results.push(senaResult[0])
  }

  if (results.length > 0) {
    return results;
  }

  return [{ type: 'NONE', games: totalGames }];
}

module.exports = { simulate };
