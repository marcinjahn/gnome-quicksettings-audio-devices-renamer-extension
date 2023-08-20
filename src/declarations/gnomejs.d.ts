declare module "gnomejs://main.js" {
  export type DeviceItem = {
    label: {
      get_text: () => string;
      set_text: (text: string) => void;
    };
  };

  type VolumeIndicator = {
    _deviceItems: Map<number, DeviceItem>;
    _removeDevice: (id: number) => void;
    _addDevice: (id: number) => void;
  };

  export const panel: {
    statusArea: {
      quickSettings: {
        _volumeOutput: {
          _output: VolumeIndicator;
        };
        _volumeInput: {
          _input: VolumeIndicator;
        };
        menu: {
          _grid: {
            get_children: () => [{ text: string }];
          };
        };
      };
    };
  };
}

declare module "gnomejs://volume.js" {
  import Gvc from "@gi-types/gvc1";

  export function getMixerControl(): Gvc.MixerControl;
}

declare module "gnomejs://extension.js" {
  import Gio from "@gi-ts/gio2";

  export class Extension {
    uuid: string;
    getSettings(uuid: string): Gio.Settings;
  }
}

declare module "gnomejs://prefs.js" {
  import Gio from "@gi-ts/gio2";

  export class ExtensionPreferences {
    getSettings(uuid: string): Gio.Settings;
  }
}
