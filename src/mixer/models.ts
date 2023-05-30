export interface MixerEvent {
  type: "active-input-update" | "active-output-update";
  deviceId: number;
}

export interface MixerSubscription {
  ids: number[];
}
