import { NamesMap } from "settings";

/**
 * Reverses each entry in the map, so that the value becomes a key, and key becomes a value
 * in the resulting object
 * @param map Input names map
 * @returns Reversed map
 */
export function reverseNamesMap(map: NamesMap): NamesMap {
  return Object.keys(map).reduce(
    (acc, originalName) => ({
      ...acc,
      [map[originalName]]: originalName,
    }),
    {} as NamesMap
  );
}
