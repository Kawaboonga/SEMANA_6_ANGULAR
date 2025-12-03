
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
/**
 * @description
 * Corta un texto a un máximo de caracteres y añade “…” al final si supera
 * el límite.  
 *
 * Es ideal para tarjetas, listados y cualquier UI donde se necesite evitar
 * que un texto demasiado largo rompa el layout.
 *
 * @usageNotes
 * Uso básico en plantillas Angular:
 * ```html
 * <p>{{ curso.description | truncate:90 }}</p>
 * ```
 *
 * Si no se especifica un valor, `max` por defecto es `120`.
 */
export class TruncatePipe implements PipeTransform {

  /**
   * @param value
   * Texto original que deseas truncar.  
   * Se aceptan `string`, `null` o `undefined` para evitar errores.
   *
   * @param max
   * Número máximo de caracteres permitidos antes del truncado.  
   * Por defecto: `120`.
   *
   * @returns
   * - El texto truncado con “…” al final si `value.length > max`.  
   * - El texto completo si es más corto que `max`.  
   * - Una cadena vacía si `value` es `null` o `undefined`.
   *
   * @example
   * ```ts
   * truncatePipe.transform("Hola mundo", 4);
   * // → "Hola…"
   * ```
   *
   * @example
   * ```html
   * <p>{{ noticia.subtitle | truncate:60 }}</p>
   * ```
   */
  transform(value: string | null | undefined, max = 120): string {
    if (!value) return '';
    return value.length > max ? value.slice(0, max).trimEnd() + '…' : value;
  }
}
