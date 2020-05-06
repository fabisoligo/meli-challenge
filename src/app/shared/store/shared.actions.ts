/**
 * Indica que la app está cargando información.
 */
export class LoadingInitAction {

  /** Identificador de la acción. */
  static readonly type = `loading init`;
}

/**
 * Indica que la app terminó de cargar información.
 */
export class LoadingCompleteAction {

  /** Identificador de la acción. */
  static readonly type = `loading complete`;
}
