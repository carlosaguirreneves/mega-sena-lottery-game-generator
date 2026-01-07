const { generateGames } = require('./src/generate-games');
const { simulate } = require('./src/simulate');
const { lastContests } = require('./src/last-contests');

const game1 = generateGames(lastContests, {lowRangeConfig: {min: 1}}, 1);
const game2 = generateGames(lastContests, {lowRangeConfig: {min: 2}}, 1);

console.log(game1[0]);
console.log(game2[0]);

const gameTarget = new Set([10, 18, 21, 24, 43, 47]);

const config = {
  lowRangeConfig: { min: 1}
};

const results = simulate({
  lastContests,
  gameTarget,
  config,
  bets: 1,
  attempts: 10000
});

console.log(results);