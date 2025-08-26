# ManagerPlaneTool

Aplicación para organizar los dispositivos informáticos de la empresa (ordenadores, impresoras), los cuales serán visibles con vista zenital a través de un layout y ubicados en distintas zonas/plantas del edificio.

## CARACTERÍSTICAS:

- ✅ La interfaz de la app debe ser con la barra lateral de navegación por la izquierda y a la derecha el plano seleccionado con los dispositivos que lo integran.

- ✅ Las zonas deben ser editables y poder reubicarse manualmente (paredes, escritorios, etc.),.

- ✅ Crear un botón en la barra lateral tipo “+” con la función de añadir un nuevo dispositivo entonces se despliega una lista de 3 opciones: pc, red o impresora (esto determinará el icono que se utilizará).
Una vez seleccionado el dispositivo se abre una pequeña ventana de nombre "Info del dispositivo" con una fila llamada NOMBRE(clave) y a su derecha un campo vacio para escribir (valor).
En la parte de abajo de la ventana habrá un boton "Guardar" para guardar los cambios y terminar, y otro botón "Añadir propiedad" que tendrá la función de añadir una fila debajo de nombre con 2 campos vacios donde el usuario podrá añadir nuevas datos como "clave"(izquierda) y "valor"(derecha). Además, a la derecha de cada una de estas nuevas filas opcionales habrá un boton "Borrar" para eliminar cada fila.
Cuando se confirma la creación del dispositivo (con el botón "Guardar"), este aparece en algún lugar del plano para poder arrastrarlo al sitio deseado.

- ✅ La ubicación de los dispositivos también debe poder cambiarse a otro lugar del plano (drag & drop).

- ✅ Al hacer hover sobre algún dispositivo saldrá una leyenda con el nombre.

- ❌ Al hacer doble click sobre un dispositivo saldrá una modal con la info completa del dispositivo. Habrá un icono tipo “lápiz” para editar la información.

- ✅ La información de cada dispositivo se almacenará en formato json o alternativa, siempre y cuando la información pueda ser actualizada en cualquier momento sin editar el archivo json.

- ✅ Añadir un botón tipo "Editar área de trabajo" ubicado en la parte superior de canvas. Dicho botón tendrá una una lista desplegable con opciones para añadir objetos al plano (Pared, Puerta y Texto para nombrar zonas).

- ❌ Crer funcionalidad modo claro/oscuro.