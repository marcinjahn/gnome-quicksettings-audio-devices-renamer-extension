import { CustomName, NamesMap, OriginalName } from "settings";

export function renameTweakerLabel(
  originalName: OriginalName,
  customName: CustomName
) {
  const tweakerLabel = getTweakerLabel(originalName);

  if (!tweakerLabel) {
    return;
  }

  tweakerLabel.text = customName;
}

export function restoreQuickSettingsTweaker(
  outputs: NamesMap,
  inputs: NamesMap
) {
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
