import { Settings } from "@gi-ts/gio2";
import {Variant} from '@gi-ts/glib2';

const ExtensionUtils = imports.misc.extensionUtils;

const SettingsPath =
  "org.gnome.shell.extensions.quicksettings-audio-devices-renamer";

export const OutputNamesMap = "output-names-map";
export const InputNamesMap = "input-names-map";

export class SettingsUtils {
  private settings: Settings | null = null;

  private getSettings(): Settings {
    if (!this.settings) {
      this.settings = ExtensionUtils.getSettings(SettingsPath);
    }

    return this.settings;
  }

  getOutputNamesMap(): NamesMap {
    const settings = this.getSettings();
    const value = settings.get_value(OutputNamesMap);

    return value.recursiveUnpack() as NamesMap;
  }

  setOutputNamesMap(values: NamesMap) {
    const settings = this.getSettings();
    settings.set_value(OutputNamesMap, new Variant('a{ss}', values));
  }

  updateOutputName(originalName: string, newName: string) {
    const values = this.getOutputNamesMap();
    values[originalName] = newName;

    this.setOutputNamesMap(values);
  }

  getInputNamesMap(): NamesMap {
    const settings = this.getSettings();
    const value = settings.get_value(InputNamesMap);

    return value.recursiveUnpack() as NamesMap;
  }

  setInputNamesMap(values: NamesMap) {
    const settings = this.getSettings();
    settings.set_value(InputNamesMap, new Variant('a{ss}', values));
  }

  updateInputName(originalName: string, newName: string) {
    const values = this.getInputNamesMap();
    values[originalName] = newName;
    
    this.setInputNamesMap(values);
  }

  connectToChanges(settingName: string, func: () => void): number {
    return this.getSettings().connect(`changed::${settingName}`, func);
  }

  disconnect(subscriptionId: number) {
    this.getSettings().disconnect(subscriptionId);
  }

  dispose() {
    this.settings = null;
  }
}

export type OriginalName = string;
export type CustomName = string;
export type NamesMap = Record<OriginalName, CustomName>;