
/**
 * Configuración de ambiente.
 */
export interface Environment {

    /** True si el ambiente es prod. False de lo contrario. */
    production: boolean;

    /** Protocolo HTTP del servidor. */
    challengeApiProtocol: string;

    /** Nombre de dominio del servidor. */
    challengeApiDomain: string;

    /** Puerto del servidor. */
    challengeApiPort: number;
}
