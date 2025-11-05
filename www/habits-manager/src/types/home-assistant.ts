/**
 * Home Assistant specific types
 */

// Home Assistant connection types
export interface HomeAssistant {
  connection: Connection;
  states: { [entity_id: string]: HassEntity };
  config: HassConfig;
  themes: any;
  selectedTheme: any;
  panels: any;
  panelUrl: string;
  language: string;
  translationMetadata: any;
  localize: (key: string, ...args: any[]) => string;
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
  callApi: <T>(method: string, path: string, parameters?: any) => Promise<T>;
}

export interface Connection {
  subscribeEvents: (callback: (event: any) => void, eventType?: string) => Promise<() => void>;
  sendMessage: (message: any) => void;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { [key: string]: any };
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: {
    length: string;
    mass: string;
    temperature: string;
    volume: string;
  };
  location_name: string;
  time_zone: string;
  components: string[];
  config_dir: string;
  whitelist_external_dirs: string[];
  allowlist_external_dirs: string[];
  version: string;
  config_source: string;
  safe_mode: boolean;
  state: string;
  external_url: string | null;
  internal_url: string | null;
}

// Card config types
export interface CardConfig {
  type: string;
  title?: string;
  entity?: string;
  entities?: string[];
}

// Lovelace card element
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: CardConfig): void;
  getCardSize?(): number;
}

// Custom card editor
export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: CardConfig): void;
}

// Service call data
export interface ServiceCallData {
  [key: string]: any;
}

// Service response
export interface ServiceCallResponse {
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}
