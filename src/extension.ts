import { disposeDelayTimeouts } from "./utils/delay";

import {
  AudioPanel,
  SubscriptionId,
  generateDiffUpdate,
  generateUpdateFromSingleState,
} from "./audio-panel";
import { AudioPanelMixerSource, MixerWrapper } from "./mixer";
import {
  InputNamesMap,
  NamesMap,
  OutputNamesMap,
  SettingsUtils,
} from "./settings";
import { reverseNamesMap } from "utils/names-map-utils";

class Extension {
  private _uuid: string | null = null;
  private _mixer: MixerWrapper | null = null;
  private _audioPanel: AudioPanel | null = null;
  private _settings: SettingsUtils | null = null;
  private _outputSettingsSubscription: number | null = null;
  private _inputSettingsSubscription: number | null = null;
  private _lastOutputsMap: NamesMap | null = null;
  private _lastInputsMap: NamesMap | null = null;
  private _audioPanelOutputsSub: SubscriptionId | null = null;
  private _audioPanelInputsSub: SubscriptionId | null = null;

  constructor(uuid: string) {
    this._uuid = uuid;
  }

  enable() {
    log(`Enabling extension ${this._uuid}`);

    this._audioPanel = new AudioPanel();
    this._settings = new SettingsUtils();

    new AudioPanelMixerSource().getMixer().then((mixer) => {
      this._mixer = mixer;

      // TEMPORARY, for fresh start
      // this._settings?.setInputNamesMap({});
      // this._settings?.setOutputNamesMap({});

      this.setupSettingMapsChangesHandling();
      this.initialSettingsSetup();
      this.setupAudioPanelChangesSubscription();

      this.forceOutputAudioPanelUpdate();
      this.forceInputAudioPanelUpdate();
    });
  }

  setupSettingMapsChangesHandling() {
    if (!this._settings) {
      return;
    }

    this._outputSettingsSubscription = this._settings.connectToChanges(
      OutputNamesMap,
      this.outputsSettingsMapUpdated.bind(this)
    );

    this._inputSettingsSubscription = this._settings.connectToChanges(
      InputNamesMap,
      this.inputsSettingsMapUpdated.bind(this)
    );
  }

  outputsSettingsMapUpdated() {
    if (!this._settings || !this._lastOutputsMap || !this._audioPanel) {
      return;
    }

    const newMap = this._settings.getOutputNamesMap();

    const updates = generateDiffUpdate(this._lastOutputsMap, newMap);

    this._lastOutputsMap = newMap;

    log("updates");
    updates.forEach((update) => {
      log(`${update.oldName} : ${update.newName}`);
    });

    this._audioPanel.applyUpdate(updates, "output");
  }

  forceOutputAudioPanelUpdate() {
    if (!this._settings || !this._lastOutputsMap || !this._audioPanel) {
      return;
    }

    const map = this._settings.getOutputNamesMap();
    const updates = generateUpdateFromSingleState(map);

    this._audioPanel.applyUpdate(updates, "output");
  }

  forceInputAudioPanelUpdate() {
    if (!this._settings || !this._lastInputsMap || !this._audioPanel) {
      return;
    }

    const map = this._settings.getInputNamesMap();
    const updates = generateUpdateFromSingleState(map);

    this._audioPanel.applyUpdate(updates, "input");
  }

  inputsSettingsMapUpdated() {
    if (!this._settings || !this._lastInputsMap || !this._audioPanel) {
      return;
    }

    const newMap = this._settings.getInputNamesMap();

    const updates = generateDiffUpdate(this._lastInputsMap, newMap);

    this._lastInputsMap = newMap;

    this._audioPanel.applyUpdate(updates, "input");
  }

  setupAudioPanelChangesSubscription() {
    if (!this._audioPanel) {
      return;
    }

    this._audioPanelOutputsSub = this._audioPanel.subscribeToAdditions(
      "output",
      () => {
        log("NEW STUFF");
        this.setOutputsMapInSettings();
        this.forceOutputAudioPanelUpdate();
      }
    );

    this._audioPanelOutputsSub = this._audioPanel.subscribeToAdditions(
      "input",
      () => {
        this.setInputsMapInSettings();
        this.forceInputAudioPanelUpdate();
      }
    );
  }

  initialSettingsSetup() {
    this.setOutputsMapInSettings();
    this.setInputsMapInSettings();

    this._lastOutputsMap = this._settings!.getOutputNamesMap();
    this._lastInputsMap = this._settings!.getInputNamesMap();
  }

  setOutputsMapInSettings() {
    log("setOutputsMapInSettings");
    if (!this._settings || !this._audioPanel) {
      return;
    }

    const allOutputIds = this._audioPanel.getDisplayedDeviceIds("output");
    const allOriginalOutputNames = this._mixer
      ?.getAudioDevicesFromIds(allOutputIds, "output")
      ?.map(({ displayName }) => displayName);

    if (!allOriginalOutputNames) {
      return;
    }

    const existingOutputsMap = this._settings.getOutputNamesMap();

    log("current");
    Object.keys(existingOutputsMap).forEach((key) => {
      log(`${key} : ${existingOutputsMap[key]}`);
    });

    const existingOriginalOutputs = Object.keys(existingOutputsMap);
    const newDevices = allOriginalOutputNames.filter(
      (name) => !existingOriginalOutputs.includes(name)
    );

    const newSettings: NamesMap = {
      ...existingOutputsMap,
      ...newDevices.reduce(
        (acc, originalDeviceName) => ({
          ...acc,
          [originalDeviceName]: originalDeviceName,
        }),
        {}
      ),
    };

    log("new");
    Object.keys(newSettings).forEach((key) => {
      log(`${key} : ${newSettings[key]}`);
    });

    this._settings.setOutputNamesMap(newSettings);
  }

  setInputsMapInSettings() {
    const allInputIds = this._audioPanel!.getDisplayedDeviceIds("input");
    const allOriginalInputNames = this._mixer
      ?.getAudioDevicesFromIds(allInputIds, "input")
      ?.map(({ displayName }) => displayName);

    if (!allOriginalInputNames) {
      return;
    }

    const existingInputsMap = this._settings!.getInputNamesMap();
    const existingOriginalInputs = Object.keys(existingInputsMap);
    const newDevices = allOriginalInputNames.filter(
      (name) => !existingOriginalInputs.includes(name)
    );

    const newSettings = {
      ...existingInputsMap,
      ...newDevices.reduce(
        (acc, originalDeviceName) => ({
          ...acc,
          [originalDeviceName]: originalDeviceName,
        }),
        {}
      ),
    };

    this._settings?.setInputNamesMap(newSettings);
  }

  disable() {
    log(`Disabling extension ${this._uuid}`);

    this._mixer?.dispose();

    if (this._outputSettingsSubscription) {
      this._settings?.disconnect(this._outputSettingsSubscription!);
      this._outputSettingsSubscription = null;
    }

    if (this._inputSettingsSubscription) {
      this._settings?.disconnect(this._inputSettingsSubscription!);
      this._inputSettingsSubscription = null;
    }

    if (this._audioPanelOutputsSub) {
      this._audioPanel?.unsubscribeFromAdditions(
        "output",
        this._audioPanelOutputsSub
      );
      this._audioPanelOutputsSub = null;
    }

    if (this._audioPanelInputsSub) {
      this._audioPanel?.unsubscribeFromAdditions(
        "input",
        this._audioPanelInputsSub
      );
      this._audioPanelInputsSub = null;
    }

    this.restoreOutputs();
    this.restoreInputs();

    disposeDelayTimeouts();

    this._settings?.dispose();

    this._settings = null;
    this._audioPanel = null;
    this._lastOutputsMap = null;
    this._lastInputsMap = null;
    this._mixer = null;
  }

  restoreOutputs() {
    const freshOutputsMap = this._settings?.getOutputNamesMap();

    if (freshOutputsMap) {
      const update = generateUpdateFromSingleState(
        reverseNamesMap(freshOutputsMap)
      );
      this._audioPanel?.applyUpdate(update, "output");
    }
  }

  restoreInputs() {
    const freshInputsMap = this._settings?.getInputNamesMap();

    if (freshInputsMap) {
      const update = generateUpdateFromSingleState(
        reverseNamesMap(freshInputsMap)
      );
      this._audioPanel?.applyUpdate(update, "input");
    }
  }
}

export default function (meta: { uuid: string }): Extension {
  return new Extension(meta.uuid);
}
