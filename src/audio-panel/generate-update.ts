import { UpdateType } from "models/update-type";
import { NamesMap } from "../settings";

export function generateDiffUpdate(
  currentState: NamesMap,
  desiredState: NamesMap
) {
  const updates: UpdateType[] = [];

  Object.keys(desiredState).forEach((originalName) => {
    if (currentState[originalName] === desiredState[originalName]) {
      return;
    }

    if (currentState[originalName]) {
      updates.push({
        oldName: currentState[originalName],
        newName: desiredState[originalName],
      });
    }
  });

  return updates;
}

export function generateUpdateFromSingleState(state: NamesMap) {
  return Object.keys(state).map((originalName) => ({
    oldName: originalName,
    newName: state[originalName],
  }));
}
