# Quick Settings Audio Devices Renamer Gnome Extension

<a href="https://extensions.gnome.org/extension/5964/quick-settings-audio-devices-hider/">
<img src="https://raw.githubusercontent.com/marcinjahn/gnome-quicksettings-audio-devices-renamer-extension/8e9404e349a0cf6c235cf69394a6292c6eef4cae/img/get-it-on-ego.svg" height="100" alt="Get it on GNOME Extensions"/>
</a>

This is a Gnome Shell Extension that allows you to rename the devices that you
 see in the Quick Settings Audio Panel. It supports both output and input
devices. It makes it easier to switch fast between your audio devices when their
names are a bit less explicit, as it is by default.

For example, instead of having "Speaker - Family 17h/19h HD Audio Controller" in
the panel, you could simply have it as "Laptop Speakers", or whatever else you'd
want to see there.

![Gnome Outputs in Quick Settings](./img/audio-panel.png)

## Configuration

The devices names may be configured via preferences window.

### Output Devices

<img alt="Output Settings" src="https://github.com/marcinjahn/gnome-quicksettings-audio-devices-renamer-extension/blob/main/img/outputs-preferences.png?raw=true" width="80%">

### Input Devices

<img alt="Input Settings" src="https://github.com/marcinjahn/gnome-quicksettings-audio-devices-renamer-extension/blob/main/img/inputs-preferences.png?raw=true" width="80%">

## Remarks

- note that the extension does not rename the devices "deep" in the system. It
only renames their labels in the Gnome Shell Quick Setting Audio Panel. If
anything looks fishy to you, all you got to do is disable the extension, and
re-login to your system. All names will be restored to their original form.

- if, in addition to renaming your devices, you'd also like to remove some of
them from Quick Settings, try out my [Quick Settings Audio Devices
Hider](https://github.com/marcinjahn/gnome-quicksettings-audio-devices-hider-extension)
extension