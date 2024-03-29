import * as Main from "gnomejs://main.js";

import { ObservableMap } from "utils/observable-map";
import { DeviceType } from "../identification";
import { UpdateType } from "models/update-type";

const QuickSettings = Main.panel.statusArea.quickSettings;

export class AudioPanelWrapper {
  getDisplayedDeviceIds(type: DeviceType): number[] {
    const devices =
      type === "output"
        ? QuickSettings._volumeOutput._output._deviceItems
        : QuickSettings._volumeInput._input._deviceItems;

    return Array.from(devices, ([id]) => id);
  }

  applyUpdate(updates: UpdateType[], type: DeviceType) {
    const devices =
      type === "output"
        ? QuickSettings._volumeOutput._output._deviceItems
        : QuickSettings._volumeInput._input._deviceItems;

    Array.from(devices, ([_, value]) => value).forEach((entry) => {
      const currentName = entry.label.get_text();

      const newName = updates.filter(
        ({ oldName }) => oldName === currentName
      )[0]?.newName;

      if (!newName) {
        return;
      }

      entry.label.set_text(newName);
    });
  }

  /**
   * Subscribes to events of Audio Panel list growing.
   * It is an alternative to Mixer output/input-added subscription,
   * which has a benefit of notifying of changes caused by the
   * quick-settings-audio-devices-hider extension
   */
  subscribeToAdditions(type: DeviceType, handler: () => void): SubscriptionId {
    const volume =
      type === "output"
        ? QuickSettings._volumeOutput._output
        : QuickSettings._volumeInput._input;

    let observableMap: ObservableMap;

    if (volume._deviceItems instanceof ObservableMap) {
      observableMap = volume._deviceItems;
    } else {
      observableMap = ObservableMap.fromNativeMap(volume._deviceItems);
      volume._deviceItems = observableMap as Map<number, Main.DeviceItem>;
    }

    return observableMap.subscribe(handler);
  }

  unsubscribeFromAdditions(type: DeviceType, subscriptionId: SubscriptionId) {
    const volume =
      type === "output"
        ? QuickSettings._volumeOutput._output
        : QuickSettings._volumeInput._input;

    if (!(volume._deviceItems instanceof ObservableMap)) {
      return;
    }

    const observableMap = volume._deviceItems as ObservableMap;

    observableMap.unsubscribe(subscriptionId);
    volume._deviceItems = observableMap.toNativeMap() as Map<
      number,
      Main.DeviceItem
    >;
  }
}

export type SubscriptionId = number;
