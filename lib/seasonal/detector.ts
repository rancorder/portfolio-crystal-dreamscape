// lib/seasonal/detector.ts
/**
 * 季節判定システム
 * 現在の日付から適切な季節を判定
 */

import { SeasonType, SeasonDefinition, SeasonConfig } from './types';
import { SEASON_DEFINITIONS } from './config';

/**
 * 現在の季節を判定
 */
export function detectCurrentSeason(date: Date = new Date()): SeasonType {
  const month = date.getMonth() + 1; // 0-11 → 1-12
  const day = date.getDate();

  // 各季節の期間をチェック
  for (const [seasonKey, definition] of Object.entries(SEASON_DEFINITIONS)) {
    if (isDateInSeason(month, day, definition)) {
      return seasonKey as SeasonType;
    }
  }

  // デフォルト（念のため）
  return 'spring';
}

/**
 * 指定した日付が季節の範囲内かチェック
 */
function isDateInSeason(
  month: number,
  day: number,
  definition: SeasonDefinition
): boolean {
  const { startMonth, startDay, endMonth, endDay } = definition;

  // 同じ年内の季節（春、梅雨、夏、秋）
  if (startMonth <= endMonth) {
    if (month < startMonth || month > endMonth) return false;
    if (month === startMonth && day < startDay) return false;
    if (month === endMonth && day > endDay) return false;
    return true;
  }

  // 年をまたぐ季節（冬: 12月〜2月）
  if (month >= startMonth && day >= startDay) return true;
  if (month <= endMonth && day <= endDay) return true;

  return false;
}

/**
 * 季節設定を取得
 */
export function getSeasonConfig(season?: SeasonType): SeasonConfig {
  const currentSeason = season || detectCurrentSeason();
  return SEASON_DEFINITIONS[currentSeason].config;
}

/**
 * 全季節のリストを取得
 */
export function getAllSeasons(): SeasonType[] {
  return Object.keys(SEASON_DEFINITIONS) as SeasonType[];
}

/**
 * 季節の説明を取得
 */
export function getSeasonDescription(season: SeasonType): string {
  return SEASON_DEFINITIONS[season].config.description;
}

/**
 * 次の季節を取得
 */
export function getNextSeason(currentSeason: SeasonType): {
  season: SeasonType;
  daysUntil: number;
} {
  const seasons = getAllSeasons();
  const currentIndex = seasons.indexOf(currentSeason);
  const nextIndex = (currentIndex + 1) % seasons.length;
  const nextSeason = seasons[nextIndex];

  const now = new Date();
  const nextSeasonDef = SEASON_DEFINITIONS[nextSeason];
  const nextSeasonStart = new Date(
    now.getFullYear(),
    nextSeasonDef.startMonth - 1,
    nextSeasonDef.startDay
  );

  // 来年の場合
  if (nextSeasonStart < now) {
    nextSeasonStart.setFullYear(now.getFullYear() + 1);
  }

  const daysUntil = Math.ceil(
    (nextSeasonStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    season: nextSeason,
    daysUntil,
  };
}

/**
 * デバッグ情報を取得
 */
export function getSeasonDebugInfo(): {
  currentSeason: SeasonType;
  config: SeasonConfig;
  nextSeason: { season: SeasonType; daysUntil: number };
  date: string;
} {
  const currentSeason = detectCurrentSeason();
  const config = getSeasonConfig(currentSeason);
  const nextSeason = getNextSeason(currentSeason);

  return {
    currentSeason,
    config,
    nextSeason,
    date: new Date().toISOString(),
  };
}
