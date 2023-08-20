import Gio from "@gi-ts/gio2";
import GLib from "@gi-ts/glib2";

export const SettingsPath =
  "org.gnome.shell.extensions.quicksettings-audio-devices-renamer";

export const OutputNamesMap = "output-names-map";
export const InputNamesMap = "input-names-map";

export class SettingsUtils {
  private settings: Gio.Settings;

  constructor(settings: Gio.Settings) {
    this.settings = settings;
  }

  getOutputNamesMap(): NamesMap {
    const value = this.settings.get_value(OutputNamesMap);

    return value.recursiveUnpack() as NamesMap;
  }

  setOutputNamesMap(values: NamesMap) {
    this.settings.set_value(OutputNamesMap, new GLib.Variant("a{ss}", values));
  }

  getInputNamesMap(): NamesMap {
    const value = this.settings.get_value(InputNamesMap);

    return value.recursiveUnpack() as NamesMap;
  }

  setInputNamesMap(values: NamesMap) {
    this.settings.set_value(InputNamesMap, new GLib.Variant("a{ss}", values));
  }

  connectToChanges(settingName: string, func: () => void): number {
    return this.settings.connect(`changed::${settingName}`, func);
  }

  disconnect(subscriptionId: number) {
    this.settings.disconnect(subscriptionId);
  }
}

export type OriginalName = string;
export type CustomName = string;
export type NamesMap = Record<OriginalName, CustomName>;
