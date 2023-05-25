import { DeviceType } from "./identification";

const Main = imports.ui.main;
const QuickSettings = Main.panel.statusArea.quickSettings;

export class AudioPanel {
  getDisplayedDeviceIds(type: DeviceType): number[] {
    const devices =
      type === "output"
        ? QuickSettings._volume._output._deviceItems
        : QuickSettings._volume._input._deviceItems;

    return Array.from(devices, ([id]) => id);
  }

  updateDevicesNames(updates: UpdateType[], type: DeviceType) {
    const devices = type === "output"
      ? QuickSettings._volume._output._deviceItems
      : QuickSettings._volume._input._deviceItems;

    Array.from(devices, ([_, value]) => value).forEach(entry => {
      const currentName = entry.label.get_text()

      const newName = updates.filter(({oldName}) => 
        oldName === currentName)[0]?.newName;

      if (!newName) {
        return;
      }

      entry.label.set_text(newName);
    });
  }
}

export interface UpdateType {
  oldName: string;
  newName: string
}
