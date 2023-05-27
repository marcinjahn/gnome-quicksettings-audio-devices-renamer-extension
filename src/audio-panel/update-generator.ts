import { NamesMap } from "../settings";
import { UpdateType } from "./audio-panel";

export function generateDiffUpdate(
  currentState: NamesMap, 
  desiredState: NamesMap) 
{
  log('current')
  Object.keys(currentState).forEach(key => {
    log(`${key} : ${currentState[key]}`)
  });

  log('new')
  Object.keys(desiredState).forEach(key => {
    log(`${key} : ${desiredState[key]}`)
  });


  const updates: UpdateType[] = [];

  Object.keys(desiredState).forEach(originalName => {
    if (currentState[originalName] === desiredState[originalName]) {
      return;
    }

    if (currentState[originalName]) {
      updates.push({
        oldName: currentState[originalName],
        newName: desiredState[originalName]
      });
    }
  });

  return updates;
}

export function generateUpdateFromSingleState(state: NamesMap) {
  return Object.keys(state).map(originalName => ({
    oldName: originalName,
    newName: state[originalName]
  }));
}