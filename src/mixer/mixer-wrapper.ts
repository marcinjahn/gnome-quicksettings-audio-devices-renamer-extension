import Gvc from "@gi-types/gvc1";

import { AudioDevice, DeviceType } from "../identification";
import { MixerEvent, MixerSubscription } from "./models";
import { range } from "utils/array";
import { getAudioDevice } from "identification/converters";
import { DisplayName } from "identification/display-name";

export class MixerWrapper {
  constructor(private mixer: Gvc.MixerControl, private disposal: () => void) {}

  getAudioDevicesFromIds(ids: number[], type: DeviceType): AudioDevice[] {
    return ids.map((id) => {
      const lookup =
        type === "output"
          ? this.mixer.lookup_output_id(id)
          : this.mixer.lookup_input_id(id);

      return getAudioDevice(
        id,
        lookup?.get_description(),
        lookup?.get_origin(),
        type
      );
    });
  }

  /**
   * Uses a Dummy Device "trick" from
   * https://github.com/kgshank/gse-sound-output-device-chooser/blob/master/sound-output-device-chooser@kgshank.net/base.js#LL299C20-L299C20
   * @param displayNames display names
   * @param type
   * @returns A list of matching audio devices. If a given display name is not found,
   * undefined is returned in its place.
   */
  getAudioDevicesFromDisplayNames(
    displayNames: DisplayName[],
    type: DeviceType
  ): (AudioDevice | undefined)[] {
    const dummyDevice = new Gvc.MixerUIDevice();

    const devices = this.getAudioDevicesFromIds(
      range(dummyDevice.get_id()),
      type
    );

    return displayNames.map((name) =>
      devices.find((device) => device.displayName === name)
    );
  }

  subscribeToActiveDeviceChanges(
    callback: (event: MixerEvent) => void
  ): MixerSubscription {
    const outputSubId = this.mixer.connect(
      "active-output-update",
      (_, deviceId) => callback({ deviceId, type: "active-output-update" })
    );

    const inputSubId = this.mixer.connect(
      "active-input-update",
      (_, deviceId) => callback({ deviceId, type: "active-input-update" })
    );

    return { ids: [outputSubId, inputSubId] };
  }

  unsubscribe(subscription: MixerSubscription) {
    subscription.ids.forEach((id) => {
      this.mixer.disconnect(id);
    });
  }

  dispose() {
    this.disposal();
  }
}
