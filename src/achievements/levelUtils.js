// Returns the EXP required to reach a given level (level 1 = 0, level 2 = 1000, level 3 = 2100, ...)
export function getExpForLevel(level) {
  if (level <= 1) return 0;
  let exp = 0;
  for (let i = 1; i < level; i++) {
    exp += 1000 + (i - 1) * 100;
  }
  return exp;
}

// Returns the user's current level based on total EXP
export function getLevelFromExp(exp) {
  let level = 1;
  while (exp >= getExpForLevel(level + 1)) {
    level++;
  }
  return level;
}

// Returns the EXP cap for the current level
export function getCurrentLevelCap(level) {
  return 1000 + (level - 1) * 100;
}

// Returns the user's progress within the current level
export function getExpProgress(exp) {
  const level = getLevelFromExp(exp);
  const expForCurrentLevel = getExpForLevel(level);
  const expForNextLevel = getExpForLevel(level + 1);
  return {
    level,
    expInLevel: exp - expForCurrentLevel,
    expToNextLevel: expForNextLevel - expForCurrentLevel,
    percent: ((exp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100
  };
} 