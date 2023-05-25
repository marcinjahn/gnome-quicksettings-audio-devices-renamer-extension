import { SettingsUtils } from "./settings";
import {
  PreferencesPage,
  PreferencesGroup,
  PreferencesWindow,
  EntryRow
} from '@gi-ts/adw1';

function init() {}

function fillPreferencesWindow(window: PreferencesWindow) {
  const settings = new SettingsUtils();

  window.add(createOutputsPage(settings));

  window.add(createInputsPage(settings));
}

function createOutputsPage(settings: SettingsUtils): PreferencesPage {
  const page = new PreferencesPage({
    title: "Outputs",
    iconName: "audio-speakers-symbolic",
  });

  const group = new PreferencesGroup({
    title: "Output Audio Devices",
    description: "Each rename needs to be applied"
  });
  page.add(group);

  const outputs = settings.getOutputNamesMap();
  Object.keys(outputs).forEach(originalName => {
    const customName = outputs[originalName];
    group.add(createDeviceRow(originalName, customName, settings));
  });

  return page;
}

function createInputsPage(settings: SettingsUtils): PreferencesPage {
  const page = new PreferencesPage({
    title: "Inputs",
    iconName: "audio-input-microphone-symbolic",
  });

  const group = new PreferencesGroup({
    title: "Input Audio Devices",
    description: "Each rename needs to be applied"
  });
  page.add(group);

  const inputs = settings.getInputNamesMap();
  Object.keys(inputs).forEach(originalName => {
    const customName = inputs[originalName];
    group.add(createDeviceRow(originalName, customName, settings));
  });

  return page;
}

function createDeviceRow(
  originalName: string,
  customName: string,
  settings: SettingsUtils
): EntryRow {
  const row = new EntryRow({ 
    title: originalName, 
    text: customName, 
    show_apply_button: true 
  });

  row.connect('apply', ({title, text}) => {
    settings.updateOutputName(title, text);
  });

  // TODO: Add reset button to a row to restore original name
  // row.add_suffix(toggle);

  return row;
}

export default { init, fillPreferencesWindow };
