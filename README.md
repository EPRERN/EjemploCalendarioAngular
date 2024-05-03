# Angularcalendar

Este proyecto fue creado con [Angular CLI](https://github.com/angular/angular-cli) versión 15.1.1.

## Development server

Ejecuta `ng serve -o` para un servidor de desarrollo. La aplicación se cargara automáticamente en `http://localhost:4200/`.

## Descripción

En el desarrollo de aplicaciones web, la capacidad de integrar calendarios interactivos es crucial para una experiencia de usuario fluida y organizada. 
Angular, con su estructura modular y potentes capacidades, ofrece una excelente plataforma para construir tales componentes. 

En este repositorio, podrás ver los componentes fundamentales para crear un calendario con eventos utilizando Angular.

Puedes encontrar un pdf con la documentación de este proyecto en el sigueinte link:  [PDF en Google Drive - click aquí](https://drive.google.com/file/d/13bC9mKt0B2qn38KqcxQcdveo61lkt5Oj/view?usp=drive_link)

## Estructura del calendario

Las carpetas de la aplicación son:

- ### Componentes

	- **Confirm-delete-modal**: nos servirá para la confirmación de eliminación de todos los eventos de un día en particular.
	- **Days**: será el encargado de pintar en el calendario los días del mes seleccionado.
	- **Event-form**: es un modal en el que se crearan o editaran los eventos en el calendario.
	- **Evento-tag**: es el componente que se utilizara para mostrar los eventos en el panel lateral.
	- **Months**: componente en el que mostraremos los meses del año para que sean seleccionados.
	- **Time-modal**: es un pequeño modal para la selección de hora de los eventos.
	- **Years**: será el componente para la selección de años en el calendario.
			
- ### models: 
	 - aquí encontraremos el archivo **calendar.models.ts** que contendrá los modelos necesario para el calendario y también tendremos un archivo llamado **languages.models.ts** que contendrá las configuraciones y modelos para la traducción del calendario.

- ### Services:  
	- en esta carpeta encontraremos un pequeño servicio que simulara la conexión con un API para realizar las acciones de obtener, guardar, editar y eliminar los eventos del calendario.

- ### Validators: 
	- en esta carpeta tendremos los validadores para el formulario de goToDate y para el formulario de eventos.
	
## Configuración

Para configurar los llamados a tu backend, te dejo las **rutas de los componentes** que se encargan de las **interacciones con los eventos** del calendario para que puedas modificarlos: 

1.	**Componente - Days.component.ts**: 
	- **loadDays()**: este método se encarga de llamar al backend para **obtener los días y sus eventos** correspondientes.

2.	Componente evento-tag.component.ts:
	- **openEditModal()**: este método se encarga de abrir el modal de **edición de un evento** y al terminar hace el llamado al backend para persistir los cambios.

	- **deleteEvent()**: en este método se llama al backend para la **eliminación de un evento**.

3.	Componente calendar.component.ts: 
	- **openAddEventDialog()**: este método se encarga de abrir el modal para **agregar un nuevo evento** y al terminar hace el llamado al backend para persistir los datos.

	- **deleteAllDialog()**: este método se encarga de **eliminar todos los eventos de el día** seleccionado.

//=============================================================//

Espero que este repositorio te sea de utilidad, un saludo.

//=============================================================//


