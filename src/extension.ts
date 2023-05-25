import { DeviceType, DisplayName } from "identification";
import { delay, disposeDelayTimeouts } from "utils/delay";

import { AudioPanel, UpdateType } from "./audio-panel";
import {
  AudioPanelMixerSource,
  MixerEvent,
  MixerSubscription,
  MixerWrapper,
} from "./mixer";
import {
  InputNamesMap,
  OutputNamesMap,
  SettingsUtils,
} from "./settings";

const ExtensionUtils = imports.misc.extensionUtils;

class Extension {
  private _uuid: string | null;
  private _mixer: MixerWrapper | null;
  private _mixerSubscription: MixerSubscription | null;
  private _audioPanel: AudioPanel | null;
  private _settings: SettingsUtils | null;
  private _outputSettingsSubscription: number | null;
  private _inputSettingsSubscription: number | null;
  private _lastOutputsMap: Record<string, string> | null;
  private _lastInputsMap: Record<string, string> | null;

  constructor(uuid: string) {
    this._uuid = uuid;
  }

  enable() {
    log(`Enabling extension ${this._uuid}`);

    this._audioPanel = new AudioPanel();
    this._settings = new SettingsUtils();

    new AudioPanelMixerSource().getMixer().then((mixer) => {
      this._mixer = mixer;

      this.setSettingsMaps();
      this.setupDeviceChangesSubscription();
      this.setupSettingMapsChangesHandling();
    });
  }

  setupSettingMapsChangesHandling() {
    this._outputSettingsSubscription = this._settings!.connectToChanges(
      OutputNamesMap,
      this.outputsMapUpdated.bind(this)
    );

    this._inputSettingsSubscription = this._settings!.connectToChanges(
      InputNamesMap,
      this.inputsMapUpdated.bind(this)
    );
  }

  outputsMapUpdated() {
    if (!this._settings) {
      return;
    }

    const newSettings = this._settings!.getOutputNamesMap();

    const updates: UpdateType[] = [];
    Object.keys(newSettings).forEach(originalName => {
      if (this._lastOutputsMap?.[originalName] === newSettings[originalName]) {
        return;
      }

      if (this._lastOutputsMap?.[originalName]) {
        updates.push({
          oldName: this._lastOutputsMap![originalName],
          newName: newSettings[originalName]
        });
      }
    });

    this._audioPanel?.updateDevicesNames(updates, 'output');
  }

  inputsMapUpdated() {
    if (!this._settings) {
      return;
    }

    const newSettings = this._settings!.getInputNamesMap();

    const updates: UpdateType[] = [];
    Object.keys(newSettings).forEach(originalName => {
      if (this._lastInputsMap?.[originalName] === newSettings[originalName]) {
        return;
      }

      if (this._lastInputsMap?.[originalName]) {
        updates.push({
          oldName: this._lastInputsMap![originalName],
          newName: newSettings[originalName]
        });
      }
    });

    this._audioPanel?.updateDevicesNames(updates, 'input');
  }

  setupDeviceChangesSubscription() {
    this._mixerSubscription =
      this._mixer?.subscribeToDeviceChanges((event) => {
        this.updateMapsInSettings(event);
      }) ?? null;
  }

  setSettingsMaps() {
    this.setOutputsMapInSettings();
    this.setInputsMapInSettings();
  }

  setOutputsMapInSettings() {
    const allOutputIds = this._audioPanel!.getDisplayedDeviceIds("output");
    const allOriginalOutputNames = this._mixer
      ?.getAudioDevicesFromIds(allOutputIds, "output")
      ?.map(({ displayName }) => displayName);
    if (allOriginalOutputNames) {
      const existingOutputsMap = this._settings!.getOutputNamesMap();
      const existingOriginalOutputs = Object.keys(existingOutputsMap);
      const newDevices = allOriginalOutputNames.filter(name => 
        !existingOriginalOutputs.includes(name));

      const newSettings = {
        ...existingOutputsMap,
        ...newDevices.reduce((acc, originalDeviceName) => ({
          ...acc,
          [originalDeviceName]: originalDeviceName
        }), {})
      };

      this._settings?.setOutputNamesMap(newSettings);
      this._lastOutputsMap = newSettings;
    }
  }

  setInputsMapInSettings() {
    const allInputIds = this._audioPanel!.getDisplayedDeviceIds("input");
    const allOriginalInputNames = this._mixer
      ?.getAudioDevicesFromIds(allInputIds, "input")
      ?.map(({ displayName }) => displayName);
    if (allOriginalInputNames) {
      const existingInputsMap = this._settings!.getInputNamesMap();
      const existingOriginalInputs = Object.keys(existingInputsMap);
      const newDevices = allOriginalInputNames.filter(name => 
        !existingOriginalInputs.includes(name));

      const newSettings = {
        ...existingInputsMap,
        ...newDevices.reduce((acc, originalDeviceName) => ({
          ...acc,
          [originalDeviceName]: originalDeviceName
        }), {})
      };

      this._settings?.setInputNamesMap(newSettings);
      this._lastInputsMap = newSettings;
    }
  }

  updateMapsInSettings(event: MixerEvent) {
    if (!this._mixer) {
      return;
    }

    event.type == "output-added"
      ? this.setOutputsMapInSettings()
      : this.setInputsMapInSettings();
  }

  disable() {
    log(`Disabling extension ${this._uuid}`);

    if (this._mixerSubscription) {
      this._mixer?.unsubscribe(this._mixerSubscription);
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

    this.restoreAllDevicesNames();

    disposeDelayTimeouts();

    this._settings?.dispose();

    this._settings = null;
    this._audioPanel = null;
    this._lastOutputsMap = null;
    this._lastInputsMap = null;
    this._mixer = null;
    this._mixerSubscription = null;
  }

  restoreAllDevicesNames() {
    const outputsMap = this._settings?.getOutputNamesMap();

    if(outputsMap && this._lastOutputsMap) {
      const updates: UpdateType[] = [];

      Object.keys(outputsMap).forEach(originalName => {
        updates.push({
          oldName: this._lastOutputsMap![originalName],
          newName: originalName
        });
      });

      this._audioPanel?.updateDevicesNames(updates, 'output');
    }

    const inputsMap = this._settings?.getInputNamesMap();

    if(inputsMap && this._lastInputsMap) {
      const updates: UpdateType[] = [];

      Object.keys(inputsMap).forEach(originalName => {
        updates.push({
          oldName: this._lastInputsMap![originalName],
          newName: originalName
        });
      });

      this._audioPanel?.updateDevicesNames(updates, 'input');
    }

  }
}

export default function (meta: { uuid: string }): Extension {
  return new Extension(meta.uuid);
}
