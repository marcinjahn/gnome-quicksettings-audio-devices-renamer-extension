import { DeviceType } from "../identification";
import {
  source_remove,
  PRIORITY_DEFAULT,
  SOURCE_CONTINUE,
  timeout_add,
} from "@gi-ts/glib2";

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

  applyUpdate(updates: UpdateType[], type: DeviceType) {
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

  subscribeToAdditions(type: DeviceType, handler: () => void): SubscriptionId {
    let lastCount = this.getDevicesCount(type);

    return timeout_add(PRIORITY_DEFAULT, 5000, () => {
      const newCount = this.getDevicesCount(type);

      log('newCount: ' + newCount);

      if (newCount > lastCount) {
        lastCount = newCount;
        handler();
      } else {
        lastCount = newCount;
      }

      return SOURCE_CONTINUE;
    });
  }

  unsubscribeFromAdditions(subscriptionId: SubscriptionId) {
    source_remove(subscriptionId);
  }

  private getDevicesCount(type: DeviceType) {
    return QuickSettings
    ._volume[type === 'output' ? '_output' : '_input']
    ._deviceItems.size;
  }
}

export interface UpdateType {
  oldName: string;
  newName: string
}

export type SubscriptionId = number; 