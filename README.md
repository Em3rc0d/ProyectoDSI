# ProyectoDSI

Este es un proyecto desarrollado con [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11 y TailwindCSS que implementa un sistema de gestión enfocado en productos, ventas y facturación.

## Demo en Producción

El proyecto está hosteado en Vercel y puede ser accedido en el siguiente enlace:  
[Proyecto DSI](https://proyecto-dsi.vercel.app/login)

## Estructura del Proyecto

El proyecto sigue una arquitectura modular organizada en diferentes componentes y servicios:

- **Components**: `home`, `products`, `sales`, `welcome`, entre otros.
- **Servicios**: Contiene la lógica de negocio para la interacción con la API.
- **Estilos**: Utiliza TailwindCSS para un diseño responsive y moderno.

## Características

1. **Gestión de productos**:
   - Registro de productos.
   - Búsqueda de productos.
   - Modificación de productos.

2. **Gestión de ventas**:
   - Registro y edición de ventas.
   - Búsqueda avanzada.

3. **Facturación**:
   - Generación y visualización de facturas.

4. **Navegación**:
   - Componente de `navbar` para la navegación entre las secciones.
   - Página de inicio (`home`) que da la bienvenida a los usuarios.

## Requisitos Previos

- Node.js v16+ y npm instalado.
- Angular CLI v15+.
- TailwindCSS configurado.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Em3rc0d/ProyectoDSI.git
   cd ProyectoDSI
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura los entornos:
   - Actualiza los archivos en la carpeta `environments` según tu configuración.

4. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```

## Uso

- Accede a la aplicación en: `http://localhost:4200` para desarrollo.
- Navega a través del menú para gestionar productos, ventas y facturas.

## Tecnologías Utilizadas

- **Frontend**: Angular
- **Estilos**: TailwindCSS
- **Hosting**: Vercel

## Scripts Disponibles

- `ng serve`: Ejecuta la aplicación en modo desarrollo.
- `ng build`: Compila la aplicación para producción.
- `ng test`: Ejecuta las pruebas unitarias.

## Contribuciones

Si deseas contribuir, crea un `pull request` con tus mejoras o reporta problemas en la sección de [Issues](https://github.com/Em3rc0d/ProyectoDSI/issues).
