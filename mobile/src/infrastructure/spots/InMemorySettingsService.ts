import SettingsService from '../../../../web/src/core/domain/spots/SettingsService';
import {UserConfig} from '../../../../web/src/core/domain/spots/Spot';

const maxPostsPerUserOptions: {label: string; value: number | string}[] = [];
for (let index = 0; index < 20; index += 1) {
  maxPostsPerUserOptions.push({
    label: `${index + 1}`,
    value: index + 1,
  });
}

export default class InMemorySettingsService implements SettingsService {
  private availableSettings: UserConfig[] = [
    {
      title: 'Spot público',
      subtitle:
        'Los usuarios podrán unirse a tu spot libremente si activas esta opción',
      type: 'switch',
      id: 'public',
      userType: 'admin',
    },
    {
      title: 'Configurar como playlist',
      subtitle:
        'Al reproducirse una postulación esta volverá a la lista sin reacciones',
      type: 'switch',
      id: 'playlist',
      userType: 'admin',
    },
    {
      title: 'Bloquear postulaciones',
      subtitle:
        'Los usuarios del spot sólo podrán reaccionar ó comentar tus postulaciones',
      type: 'switch',
      id: 'blockPost',
      userType: 'admin',
    },
    {
      title: 'Reproducción simultanea',
      subtitle:
        'Otros dispositivos podran reproducir el playlist en tiempo real',
      type: 'switch',
      id: 'multiplaying',
      userType: 'admin',
    },
    {
      title: 'Autosilenciar reproductor',
      subtitle:
        'Al iniciar la aplicacion el reproductor esta en modo silencioso',
      type: 'switch',
      id: 'autoMute',
      userType: 'all',
    },
    {
      title: 'Max. Canciones por usuario',
      type: 'select',
      id: 'maxPostsPerUser',
      userType: 'admin',
      options: maxPostsPerUserOptions,
    },
    {
      title: 'Proveedor de Música',
      type: 'select',
      id: 'provider',
      userType: 'admin',
      options: [
        {value: 'youtube', label: 'YouTube'},
        {value: 'deezer', label: 'Deezer'},
        {value: 'spotify', label: 'Spotify'},
      ],
    },
  ];

  getAvailableSettings(): UserConfig[] {
    return this.availableSettings;
  }
}
