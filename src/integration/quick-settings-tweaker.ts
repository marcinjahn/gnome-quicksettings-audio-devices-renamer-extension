import { UpdateType } from "models/update-type";
import { NamesMap } from "settings";

export function applyUpdateToQst({ oldName, newName }: UpdateType) {
  const tweakerLabel = getTweakerLabel(oldName);

  if (!tweakerLabel) {
    return;
  }

  tweakerLabel.text = newName;
}

export function restoreQst(outputs: NamesMap, inputs: NamesMap) {
  restore(outputs);
  restore(inputs);
}

function restore(map: NamesMap) {
  for (const originalName of Object.keys(map)) {
    const label = getTweakerLabel(map[originalName]);

    if (label) {
      label.text = originalName;
      break;
    }
  }
}

function getTweakerLabel(content: string): { text: string } | null {
  const grid = imports.ui.main.panel.statusArea.quickSettings.menu._grid;
  const children = grid.get_children();
  const tweakerLabel = children.filter((c) => c.text === content);

  return tweakerLabel.length > 0 ? tweakerLabel[0] : null;
}
