import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

export default (strings = new LocalizedStrings({
  en: {
    searchOnDeezer: 'Search on Deezer',
    searchResults: 'Search results',
    noResults: 'No results',
    searchByText: 'Search by text',
    permissionDenied: 'Permission denied',
    inappropiateSearchMessage:
      'Sorry, you are traying to search inappropiate content',
    termsTitle: 'Terms of service',
    agree: 'Agree',
    decline: 'Decline',
    alreadyReported: 'Already reported',
    alreadyReportedDesc: 'It was reported by you previously',
    reportTitle: 'Why do you report it?',
    promoteInappropiate: 'It promotes inappropriate content',
    inappropiateContent: 'It is inappropiate content',
    spam: 'It is spam',
    report: 'Report',
    reportSpot: 'Report Spot',
    signIn: 'Sign in with',
    popularSpots: 'Popular Spots',
    popularSpotsDesc: 'This are the most popular Spots between the users',
    nearSpots: 'Near of you',
    nearSpotsDesc: 'This are the nearest Spots ordered by distance',
    mySpots: 'My Spots',
    mySpotsDesc: 'Spots that you are administrator',
    online: 'Online',
    offline: 'Offline',
    musicCategory: 'Category',
    scanQr: 'Scan QR code',
    settings: 'Settings',
    logout: 'Log out',
    searchSpots: 'Search Spots',
    manageUsers: 'Manage users',
    inviteFriend: 'Invite a friend',
    currentSpot: 'Current Spot',
    spotsOnMap: 'Show Spots on map',
    privateSpotMessage:
      'This Spot is private, you can only access with an invitation',
    noPosts: 'There is no published videos',
    posted: 'Published',
    suggestions: 'Suggestions',
    watchComments: 'Watch comments',
    playNow: 'Play now',
    blockUser: 'Block user',
    block: 'Block',
    unblockUser: 'Unblock',
    delete: 'Delete',
    post: 'Publish',
    singularPosted: 'published',
    reproducing: 'Reproducing',
    comments: 'Comments',
    singulatComment: 'comment',
    comment: 'Comment',
    publishedBy: 'Published by',
    minutes: 'minutes',
    singularMinute: 'minute',
    seconds: 'seconds',
    singularSecond: 'second',
    hours: 'hours',
    singularHour: 'hour',
    days: 'days',
    singularDay: 'day',
    weeks: 'weeks',
    singularWeek: 'week',
    years: 'years',
    singularYear: 'year',
    publishTime: '{0} {1} ago',
    joinTime: 'Joined on {0} at {1}',
    userSettings: 'User settings',
    spotSettings: 'Spot settings',
    adminConnections: 'Admin connections',
    player: 'Player',
    changeToPlayer: 'Change to player',
    notifyReactions: 'Notify reactions',
    notifyReactionsDesc:
      'Enable / disable  notification for your published videos reactions',
    notifyComments: 'Notify comments',
    notifyCommentsDesc:
      'Enable / disable  notification for your published videos comments',
    configureAsPlaylist: 'Configure as playlist',
    configureAsPlaylistDesc: 'The played videos will go back to playlist',
    blockPost: 'Block publish videos',
    blockPostDesc:
      'The Spot users only could react or comment your published videos',
    blockReact: 'Block react to videos',
    blockReactDesc: 'The Spot users only could comment your published videos',
    userBlockedMessage: 'You has beend blocked to interact in this Spot',
    blockUserSuccess: 'The user has been added to blocked users list',
    unblockUserSuccess: 'The user has been removed from blocked users list',
    blockedReactionsMessage: 'The admin has ended the time to react',
    videoNotFount: 'The video is not in published videos list',
    notPublished: 'No se postuló',
    youtubeSearch: 'Search on YouTube',
    videoAlreadyPublished: 'Video is already published',
    maxPostsUserMessage: 'This spots has a maximum of {0} videos to publish',
    maxPostsSpotMessage:
      'You can only have a maximum of {0} posted videos. Delete one of the list or await for its playing',
    blockedPostsMessage:
      'The admin has blocked publishing action, you can only react to videos',
    confirmDeleteSpot:
      'Press accept to confirm the spot deleting. It will be deleted permanently',
    notHaveSpots: 'You do not have Spots',
    accept: 'Accept',
    cancel: 'Cancel',
    basicInformation: 'Basic information',
    spotName: 'Spot name',
    description: 'Description',
    spotAddress: 'Spot Place / Address',
    spotPrivacy: 'Spot privacy',
    initialConfig: 'Initial settings',
    enterSpotName: 'Enter a Spot name',
    enterDescription: 'Enter a Spot description',
    enterMusicCategory: 'Enter a music category',
    createdSpotMessage: 'The Spot has been created',
    createError: 'Create error',
    createSpotError: 'Sorry, the Spot could not be created',
    uploadImageError:
      'Sorry, an error has ocurred with cover picture uploading',
    next: 'Next',
    create: 'Create',
    back: 'Back',
    skip: 'Skip',
    createSpot: 'Create Spot',
    uploadCoverPicture: 'Upload a cover picture',
    fromGallery: 'From gallery',
    fromCamera: 'From camera',
    searchCity: 'Search your city',
    dragAndDrop: 'Drag and drop to the spot location',
    newSpot: 'New Spot',
    public: 'Public',
    publicSpot: 'Public Spot',
    publicSpotDesc: 'User can find and join to your Spot',
    private: 'Private',
    privateSpotDesc:
      'Spot only can accessed with your invitation or QR Scanning',
    freeSpot: 'Free Spot',
    freeSpotDesc: 'All users can publish and react to videos',
    withPublishBocking: 'With publish blocking',
    withPublishBockingDesc: 'Allow or restrict to users the publishing action',
    asPlaylist: 'As playlist behavior',
    asPlaylistDesc:
      'Add videos to a playlist that users can react to. When playing a video it will return to the list without reactions.',
  },
  es: {
    searchOnDeezer: 'Buscar en Deezer',
    searchResults: 'Resultados de busqueda',
    noResults: 'No se encontraron resultados',
    searchByText: 'Buscar por texto',
    permissionDenied: 'Permiso denegado',
    inappropiateSearchMessage:
      'Lo sentimos, esta intetando buscar contenido inapropiado',
    termsTitle: 'Terminos de servicio',
    agree: 'Aceptar',
    decline: 'Declinar',
    alreadyReported: 'Ya reportado',
    alreadyReportedDesc: 'Ya has reportado esto antes',
    reportTitle: '¿Por qué deseas reportarlo?',
    promoteInappropiate: 'Promueve el contenido inapropiado',
    inappropiateContent: 'Es contenido inapropiado',
    spam: 'Es Spam',
    report: 'Reportar',
    reportSpot: 'Reportar Spot',
    signIn: 'Ingresa con',
    popularSpots: 'Spots populares',
    popularSpotsDesc: 'Estos son los Spots mas populares entre los usuarios',
    nearSpots: 'Cerca de ti',
    nearSpotsDesc: 'Estos son los Spots más cercanos ordenados por distancia',
    mySpots: 'Mis Spots',
    mySpotsDesc: 'Spots de los que eres administrador',
    online: 'Activo',
    offline: 'Inactivo',
    musicCategory: 'Música',
    scanQr: 'Escanear QR',
    settings: 'Ajustes',
    logout: 'Cerrar sesión',
    searchSpots: 'Buscar Spots',
    manageUsers: 'Administrar usuarios',
    inviteFriend: 'Invitar a un amigo',
    currentSpot: 'Spot actual',
    spotsOnMap: 'Mostrar Spots en mapa',
    privateSpotMessage:
      'Este Spot es privado, solo podrás acceder con una invitación',
    noPosts: 'No hay postulaciones',
    posted: 'Postuladas',
    singularPosted: 'Postulado',
    suggestions: 'Sugerencias',
    watchComments: 'Ver comentarios',
    playNow: 'Reproducir ahora',
    blockUser: 'Bloquear usuario',
    unblockUser: 'Desbloquear usuario',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    delete: 'Eliminar',
    post: 'Postular',
    reproducing: 'Reproduciendo',
    comments: 'Comentarios',
    singulatComment: 'comentario',
    comment: 'Comentar',
    publishedBy: 'Postulado por',
    minutes: 'minutos',
    singularMinute: 'minuto',
    seconds: 'segundos',
    singularSecond: 'segundo',
    hours: 'horas',
    singularHour: 'hora',
    days: 'dias',
    singularDay: 'dia',
    weeks: 'semanas',
    singularWeek: 'semana',
    years: 'años',
    singularYear: 'año',
    publishTime: 'Hace {0} {1}',
    joinTime: 'Se unió el {0} a las {1}',
    userSettings: 'Ajustes de usuario',
    spotSettings: 'Ajustes de Spot',
    adminConnections: 'Conexiones de administrador',
    player: 'Reproductor',
    changeToPlayer: 'Cambiar a reproductor',
    notifyReactions: 'Notificar reacciones',
    notifyReactionsDesc:
      'Habilita / Deshabilita las notificaciones para las reacciones de tus publicaciones',
    notifyComments: 'Notificar comentarios',
    notifyCommentsDesc:
      'Habilita / Deshabilita las notificaciones para los comentarios de tus publicaciones',
    configureAsPlaylist: 'Configure as playlist',
    configureAsPlaylistDesc:
      'Al reproducirse una postulación esta volverá a la lista sin reacciones',
    blockPost: 'Block publish videos',
    blockPostDesc:
      'Los usuarios del spot sólo podrán reaccionar ó comentar tus postulaciones',
    blockReact: 'Block react to videos',
    blockReactDesc:
      'Los usuarios del spot sólo podrán comentar las postulaciones',
    userBlockedMessage: 'Has sido bloqueado para interactuar en este spot',
    blockUserSuccess: 'Se ha agregado a la lista de usuarios bloqueados',
    unblockUserSuccess: 'Se ha removido de la lista de usuarios bloqueados',
    blockedReactionsMessage:
      'El administrador ha finalizado el periodo para reaccionar a las postulaciones',
    videoNotFount: 'El video no está en la lista de postulaciones',
    youtubeSearch: 'Buscar en YouTube',
    notPublished: 'No se postuló',
    videoAlreadyPublished:
      'Este video ya está postulado, búscalo en la lista y dale un like',
    maxPostsUserMessage: 'Este Spot tiene un máximo de {0} postulaciones',
    maxPostsSpotMessage:
      'Sólo puedes tener un máximo de {0} videos en cola. Elimina uno de los postulados o espera que suenen para agregar otro',
    blockedPostsMessage:
      'El administrador ha bloqueado la postulación, solo podrás reaccionar a los videos publicados',
    confirmDeleteSpot:
      'Presiona aceptar para confirmar la eliminación del spot. Se eliminara de forma permanente',
    notHaveSpots: 'No tienes Spots creados',
    accept: 'Aceptar',
    cancel: 'Cancelar',
    basicInformation: 'Información básica',
    spotName: 'Nombre del Spot',
    description: 'Descripción',
    spotAddress: 'Lugar / Dirección del Spot',
    spotPrivacy: 'Privacidad del Spot',
    initialConfig: 'Configuración inicial',
    enterSpotName: 'Ingrese un nombre para el Spot',
    enterDescription: 'Ingrese una descripción para el Spot',
    enterMusicCategory: 'Ingrese un tipo de musica',
    createdSpotMessage: 'Se ha creado el Spot',
    createError: 'Error al crear',
    createSpotError: 'Disculpe, no se pudo crear el Spot',
    uploadImageError: 'Disculpe, no se pudo subir la imagen del Spot',
    next: 'Siguiente',
    create: 'Crear',
    back: 'Atrás',
    skip: 'Omitir',
    createSpot: 'Crear Spot',
    uploadCoverPicture: 'Sube una foto de portada',
    fromGallery: 'Desde la galería',
    fromCamera: 'Desde la camera',
    searchCity: 'Busca tu ciudad',
    dragAndDrop: 'Presiona y arrastra hasta el lugar',
    newSpot: 'Nuevo Spot',
    public: 'Público',
    publicSpot: 'Spot Público',
    publicSpotDesc: 'Todos podrán encontrar tu Spot y participar en el',
    private: 'Privado',
    privateSpotDesc: 'Sólo podrán acceder tus invitados o con escaneo de QR',
    freeSpot: 'Spot libre',
    freeSpotDesc: 'Todos los usuarios pueden postular y reaccionar a videos.',
    withPublishBocking: 'Con bloqueo de postulaciones',
    withPublishBockingDesc:
      'Permite o restringe que los participantes postulen en el Spot',
    asPlaylist: 'Tipo playlist',
    asPlaylistDesc:
      'Agrega videos a una lista de reproducción a la que los usuarios podran reaccionar. Al reproducir un video volverá a la lista sin reacciones.',
  },
}));