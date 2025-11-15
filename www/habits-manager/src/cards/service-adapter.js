import { SERVICE_DOMAIN, SERVICE_MAPPING, NEW_SERVICES } from './constants.js';

export class ServiceAdapter {
  constructor(hass) {
    this._hass = hass;
  }

  async callService(service, data) {
    const mappedService = SERVICE_MAPPING[service] || NEW_SERVICES[service];
    if (!mappedService) {
      console.warn(`Service ${service} not mapped`);
      return;
    }

    // Adapter les données selon le service
    const adaptedData = this._adaptServiceData(service, data);

    return await this._hass.callService(
      SERVICE_DOMAIN,
      mappedService,
      adaptedData
    );
  }

  _adaptServiceData(service, data) {
    switch (service) {
      case 'complete_task':
        return {
          instance_id: data.task_id,  // Doit être l'ID de l'instance
          child_id: data.child_id,
        };

      case 'adjust_points':
      case 'adjust_coins':
        // Gérer via update_child en calculant le delta
        return {
          child_id: data.child_id,
          // Les points/coins devront être gérés différemment
        };

      case 'remove_child':
        return {
          child_id: data.child_id,
          // force_remove_entities n'existe plus
        };

      default:
        return data;
    }
  }
}
