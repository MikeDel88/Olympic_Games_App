import {Signal, WritableSignal} from '@angular/core';

/**
 * Interface de gestion de l'accessibilé pour les <canvas> Chart
 */
export interface AccessibilityChart {

  /**
   * Accessibilité
   * Utiliser pour la navigation par clavier afin de connaître l'index actif.
   */
  readonly activeIndex: WritableSignal<number | null>;

  /**
   * Accessibilité
   * Rend dynamique l'aria label en fonction de la navigation de l'utilisateur.
   */
  readonly ariaLabel: Signal<string>;

  /**
   * Navigation par clavier pour l'accessibilité.
   * @param event
   */
  onKeydown(event: KeyboardEvent): void

  /**
   * Permet d'activer la navigation par clavier.
   * @param index
   */
  setActiveSlice(index: number): void

  /**
   * Reset la navigation par clavier.
   */
  onClearActiveSlice(): void
}
