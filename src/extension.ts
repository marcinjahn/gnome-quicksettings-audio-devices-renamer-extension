import { Extension } from "gnomejs://extension.js";

import { delay, disposeDelayTimeouts } from "./utils/delay";
import {
  AudioPanelWrapper,
  SubscriptionId,
  generateDiffUpdate,
  generateUpdateFromSingleState,
} from "./audio-panel";
import {
  AudioPanelMixerSource,
  MixerSubscription,
  MixerWrapper,
} from "./mixer";
import {
  InputNamesMap,
  NamesMap,
  OutputNamesMap,
  SettingsPath,
  SettingsUtils,
} from "./settings";
import { reverseNamesMap } from "utils/names-map-utils";
import {
  applyUpdateToQst,
  restoreQst,
} from "integration/quick-settings-tweaker";

export default class QuickSettingsAudioDevicesRenamerExtension extends Extension {
  private _mixer: MixerWrapper | null = null;
  private _audioPanel: AudioPanelWrapper | null = null;
  private _settings: SettingsUtils | null = null;
  private _outputSettingsSubscription: number | null = null;
  private _inputSettingsSubscription: number | null = null;
  private _lastOutputsMap: NamesMap | null = null;
  private _lastInputsMap: NamesMap | null = null;
  private _audioPanelOutputsSub: SubscriptionId | null = null;
  private _audioPanelInputsSub: SubscriptionId | null = null;
  private _activeDeviceSub: MixerSubscription | null = null;

  enable() {
    log(`Enabling extension ${this.uuid}`);

    this._audioPanel = new AudioPanelWrapper();
    this._settings = new SettingsUtils(this.getSettings(SettingsPath));

    new AudioPanelMixerSource().getMixer().then((mixer) => {
      this._mixer = mixer;

      this.setupSettingMapsChangesHandling();
      this.initialSettingsSetup();
      this.setupAudioPanelChangesSubscription();
      this.setupAcitveDeviceChangesSubscription();

      this.forceOutputAudioPanelUpdate();
      this.forceInputAudioPanelUpdate();

      // Allow Quick Settings Tweaker to load and apply its changes
      delay(500).then(() => {
        this.updateQuickSettingsTweaker();
      });
    });
  }
  updateQuickSettingsTweaker() {
    if (!this._settings) {
      return;
    }

    const maps = {
      ...this._settings.getOutputNamesMap(),
      ...this._settings.getInputNamesMap(),
    };

    Object.keys(maps).forEach((originalName) => {
      applyUpdateToQst({
        oldName: originalName,
        newName: maps[originalName],
      });
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

    this._audioPanel.applyUpdate(updates, "output");
    updates.forEach((update) => applyUpdateToQst(update));
  }

  inputsSettingsMapUpdated() {
    if (!this._settings || !this._lastInputsMap || !this._audioPanel) {
      return;
    }

    const newMap = this._settings.getInputNamesMap();
    const updates = generateDiffUpdate(this._lastInputsMap, newMap);
    this._lastInputsMap = newMap;

    this._audioPanel.applyUpdate(updates, "input");
    updates.forEach((update) => applyUpdateToQst(update));
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

  setupAudioPanelChangesSubscription() {
    if (!this._audioPanel) {
      return;
    }

    this._audioPanelOutputsSub = this._audioPanel.subscribeToAdditions(
      "output",
      () => {
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

  /**
   * Quick Settings Tweaker extension integration
   */
  setupAcitveDeviceChangesSubscription() {
    this._mixer?.subscribeToActiveDeviceChanges((event) => {
      // delay due to race condition with Quick Settings Tweaker
      delay(200).then(() => {
        if (!this._mixer || !this._settings) {
          return;
        }

        const deviceType =
          event.type === "active-output-update" ? "output" : "input";

        const devices = this._mixer.getAudioDevicesFromIds(
          [event.deviceId],
          deviceType
        );

        if (devices.length < 1) {
          return;
        }

        const map =
          deviceType === "output"
            ? this._settings.getOutputNamesMap()
            : this._settings.getInputNamesMap();

        const originalName = devices[0].displayName;
        const customName = map[originalName];

        if (!customName) {
          return;
        }

        applyUpdateToQst({
          oldName: originalName,
          newName: customName,
        });
      });
    });
  }

  initialSettingsSetup() {
    this.setOutputsMapInSettings();
    this.setInputsMapInSettings();

    this._lastOutputsMap = this._settings!.getOutputNamesMap();
    this._lastInputsMap = this._settings!.getInputNamesMap();
  }

  setOutputsMapInSettings() {
    if (!this._audioPanel || !this._mixer || !this._settings) {
      return;
    }

    const allOutputIds = this._audioPanel.getDisplayedDeviceIds("output");
    const allOriginalOutputNames = this._mixer
      .getAudioDevicesFromIds(allOutputIds, "output")
      ?.map(({ displayName }) => displayName);

    if (!allOriginalOutputNames) {
      return;
    }

    const existingOutputsMap = this._settings.getOutputNamesMap();

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

    this._settings.setOutputNamesMap(newSettings);
  }

  setInputsMapInSettings() {
    if (!this._audioPanel || !this._mixer || !this._settings) {
      return;
    }

    const allInputIds = this._audioPanel.getDisplayedDeviceIds("input");
    const allOriginalInputNames = this._mixer
      .getAudioDevicesFromIds(allInputIds, "input")
      ?.map(({ displayName }) => displayName);

    if (!allOriginalInputNames) {
      return;
    }

    const existingInputsMap = this._settings.getInputNamesMap();
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

    this._settings.setInputNamesMap(newSettings);
  }

  disable() {
    log(`Disabling extension ${this.uuid}`);

    if (this._activeDeviceSub) {
      this._mixer?.unsubscribe(this._activeDeviceSub);
      this._activeDeviceSub = null;
    }

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

    if (this._settings) {
      restoreQst(
        this._settings.getOutputNamesMap(),
        this._settings.getInputNamesMap()
      );
    }

    disposeDelayTimeouts();

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
