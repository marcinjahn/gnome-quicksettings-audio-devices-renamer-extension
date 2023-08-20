import { ExtensionPreferences } from "gnomejs://prefs.js";

import Adw from "@gi-ts/adw1";
import Gtk from "@gi-ts/gtk4";

import { DeviceType } from "identification";
import {
  CustomName,
  OriginalName,
  SettingsPath,
  SettingsUtils,
} from "./settings";
import { validate } from "settings-validation";

export default class Preferences extends ExtensionPreferences {
  fillPreferencesWindow(window: Adw.PreferencesWindow) {
    const settings = new SettingsUtils(this.getSettings(SettingsPath));

    window.add(this.createOutputsPage(settings, window));
    window.add(this.createInputsPage(settings, window));
  }

  createOutputsPage(
    settings: SettingsUtils,
    window: Adw.PreferencesWindow
  ): Adw.PreferencesPage {
    const page = new Adw.PreferencesPage({
      title: "Outputs",
      iconName: "audio-speakers-symbolic",
    });

    const group = new Adw.PreferencesGroup({
      title: "Output Audio Devices",
      description: "Rename devices and apply the changes",
    });
    page.add(group);

    const outputs = settings.getOutputNamesMap();
    Object.keys(outputs).forEach((originalName) => {
      const customName = outputs[originalName];
      group.add(
        this.createDeviceRow(
          originalName,
          customName,
          settings,
          "output",
          window
        )
      );
    });

    return page;
  }

  createInputsPage(
    settings: SettingsUtils,
    window: Adw.PreferencesWindow
  ): Adw.PreferencesPage {
    const page = new Adw.PreferencesPage({
      title: "Inputs",
      iconName: "audio-input-microphone-symbolic",
    });

    const group = new Adw.PreferencesGroup({
      title: "Input Audio Devices",
      description: "Rename devices and apply the changes",
    });
    page.add(group);

    const inputs = settings.getInputNamesMap();
    Object.keys(inputs).forEach((originalName) => {
      const customName = inputs[originalName];
      group.add(
        this.createDeviceRow(
          originalName,
          customName,
          settings,
          "input",
          window
        )
      );
    });

    return page;
  }

  createDeviceRow(
    originalName: string,
    customName: string,
    settings: SettingsUtils,
    type: DeviceType,
    window: Adw.PreferencesWindow
  ): Adw.EntryRow {
    const row = new Adw.EntryRow({
      title: originalName,
      text: customName,
      show_apply_button: true,
    });

    const resetButton = new Gtk.Button({
      icon_name: "view-refresh",
      has_frame: false,
      tooltip_text: "Restore original name",
    });

    resetButton.connect("clicked", () => {
      row.text = originalName;
      this.restoreDevice(type, settings, originalName);
    });

    row.add_suffix(resetButton);

    row.connect("apply", ({ title, text }) => {
      this.applyCustomName(type, settings, title, text, window);
    });

    return row;
  }

  applyCustomName(
    type: string,
    settings: SettingsUtils,
    originalName: OriginalName,
    customName: CustomName,
    window: Adw.PreferencesWindow
  ) {
    const currentMap =
      type === "output"
        ? settings.getOutputNamesMap()
        : settings.getInputNamesMap();

    const newMap = {
      ...currentMap,
      [originalName]: customName,
    };

    const validation = validate(newMap);

    if (!validation.isOk) {
      this.displayError(window, validation.errorMessage!);
    } else {
      type === "output"
        ? settings.setOutputNamesMap(newMap)
        : settings.setInputNamesMap(newMap);
    }
  }

  restoreDevice(type: string, settings: SettingsUtils, originalName: string) {
    const currentMap =
      type === "output"
        ? settings.getOutputNamesMap()
        : settings.getInputNamesMap();

    const newMap = {
      ...currentMap,
      [originalName]: originalName,
    };

    type === "output"
      ? settings.setOutputNamesMap(newMap)
      : settings.setInputNamesMap(newMap);
  }

  displayError(window: Adw.PreferencesWindow, error: string) {
    window.add_toast(
      new Adw.Toast({
        title: error,
        priority: Adw.ToastPriority.HIGH,
        timeout: 5,
      })
    );
  }
}
