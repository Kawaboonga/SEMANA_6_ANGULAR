
// ============================================================================
// APP ROOT COMPONENT
// ----------------------------------------------------------------------------
// Componente raíz de la aplicación.
//
// - Define el punto de entrada principal del proyecto Angular.
// - Usa RouterOutlet para renderizar la vista asociada a cada ruta configurada.
// - Mantiene una señal (signal) llamada "title" que puede utilizarse en el 
//   template para mostrar el nombre del proyecto o usarlo como estado global.
//
// Este componente se carga una sola vez al iniciar la aplicación y permanece
// activo durante todo el ciclo de vida del sitio.
// ============================================================================

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,

  // Importación del RouterOutlet para permitir que Angular dibuje
  // dinámicamente el componente correspondiente según la ruta activa.
  imports: [RouterOutlet],

  // En lugar de un template inline, se utiliza un archivo HTML independiente
  // para mantener el layout principal de la aplicación.
  /* template: `<router-outlet/>` */
  templateUrl: './app.html',

  // Hoja de estilos exclusiva del componente raíz.
  styleUrl: './app.css'
})
export class App {

  // --------------------------------------------------------------------------
  // title (signal)
  //
  // Se utiliza una señal porque permite exponer un valor reactivo que puede
  // ser leído directamente en el HTML. Ideal para mostrar información global,
  // como el nombre del proyecto o un estado que deba renderizarse sin crear
  // servicios adicionales.
  //
  // Ejemplo de uso en app.html:
  //   {{ title() }}
  //
  // *La señal se declara como protected para evitar su acceso externo directo.
  // --------------------------------------------------------------------------
  protected readonly title = signal('Proyecto');
}
