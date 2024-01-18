#  Estándar JavaScript - Arawato Media

## Cómo usar ESLint y Prettier para mejorar tu código JavaScript 
Puedes ver esta guía de ESLint en [Platzi](https://platzi.com/tutoriales/1099-fundamentos-javascript-2017/2181-como-usar-eslint-y-prettier-para-mejorar-tu-codigo-javascript/)

## Cómo funcionan
ESLint es un linter de código JavaScript. Su función es analizar el código de nuestra aplicación, detectar problemas en el por medio de patrones y si esta a su alcance resolverlos él mismo.

Por otro lado, Prettier es un formateador de código. Tambien analiza nuestro código JavaScript. Pero no solo detecta problemas (como la longitud de una linea, o si una variable no se usa nunca); re-escribe nuestro código cada vez que salvamos un archivo, permitiéndonos ver y entender cuales son los problemas de nuestra aplicación.

Usando ambas herramientas obtendremos un entorno de trabajo mucho más cómodo, limpio y eficaz. Ahora, aprendamos a usar estas herramientas!
## Instalación y configuración base de ESLint
Comencemos instalando ESLint y babel-eslint. Este ultimo paquete le ayudara a eslint a entender código JavaScript un poco más avanzado que ES6:

```
yarn add eslint babel-eslint -D
```
Después de la instalación, podemos usar una herramienta de eslint para crear nuestra configuración base por medio de preguntas. Podemos usarla corriendo el siguiente comando:
```
./node_modules/.bin/eslint --init
```
Ahora tenemos que responder algunas preguntas para que ESLint cree nuestro archivo de configuración y podamos añadirle otras herramientas como Prettier. Yo recomendaría contestar las preguntas de la siguiente forma:

How would you like to configure ESLint?

Podemos configurar ESLint respondiendo algunas preguntas sobre nuestro código, usar una guía de estilos popular o dejar que eslint inspeccione nuestros archivos JavaScript y con base a esto arme la configuración más adecuada. Responde usar una guía de estilos. Por ser guías de estilos bastante populares están muy bien probadas y documentadas, así que son la mejor opción.

Which style guide do you want to follow?

Podemos usar la guía de estilos de [Google](https://google.github.io/styleguide/jsguide.html), de [AirBnB](https://github.com/airbnb/javascript) o de [Standard](https://standardjs.com/). **En Arawato usaremos la guía de estilos de [AirBnB](https://github.com/airbnb/javascript) ya que es bastante completa y actualizada**. Tambien tiene soporte para React y CSS in JS.

Do you use React?

En realidad la pregunta no es si usamos React, sino si usamos JSX, o JavaScript XML. Si estas construyendo un proyecto con Reactjs debes responder Y, en caso contrario N.

What format do you want your config file to be in?

Por último debemos elegir el formato de archivo para nuestra configuración de ESLint. Puedes usar JavaScript, YAML o JSON. En arawato usaremos JSON para los archivos de configuración.

Habiendo respondido la ultima pregunta, ESLint instalara los paquetes necesarios para seguir las instrucciones que le dimos con las respuestas y creara un archivo de configuración llamado .eslintrc.json. En este archivo está nuestra configuración. Ahora vamos a editarlo para añadir las configuraciones necesarias de Prettier.

## Configuración de ESLint usando Prettier
Con nuestra configuración base lista, podemos instalar los siguientes paquetes de prettier para que junto con ESLint nos ayuden a crear un entorno de trabajo mucho mejor:
```
yarn add --dev prettier eslint-plugin-prettier eslint-config-prettier
```

Instalados estos paquetes, podemos ir a nuestro archivo de configuración de ESLint y añadir la configuración necesaria para usar Prettier. Tendremos que añadir las siguientes instrucciones:
```
{
	// añade la opción "parser" con "babel-eslint"
	"parser": "babel-eslint",

	// añade "prettier" (y si quieres "prettier/react") a las opciones de "extends"
	"extends": ["airbnb", "prettier", "prettier/react"],

	// y por ultimo, en la llave de "plugins" añade el plugin de eslint para prettier
	"plugins": ["prettier"]

	// ...
}
```

## Lint Staged
Con nuestra configuración de ESLint lista, ya podemos escribir código JavaScript mucho mas limpio y ordenado. Pero podemos hacer aun mas! Usando lint-staged podremos estar seguros de que el código que subimos a Github o cualquier otro repositorio de Git siempre este revisado por ESLint y Prettier.

**Instalación de Lint Staged**

```
yarn add lint-staged husky
```

**Configuración de Lint Staged**
```
// .lintstagedrc.json

{
  "*.js": ["eslint --fix", "git add"]
}
```

**Nuevo Script en el package.json**

```
// package.json

"scripts": {
	"precommit": "lint-staged",
},
```

Con esta nueva configuración en nuestro proyecto, podemos estar seguros de que el código que escribimos junto con nuestro equipo de desarrollo siempre estará linteado por ESLint y Prettier gracias a Lint Staged.

# Archivos en la carpeta raiz del proyecto

## Ejemplo de _package.json_ (Configurado para ESLint y Prettier)

```
{
  "name": "wateke-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    // Todas las depenedencias
  },
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject",
    "lint": "eslint ./",
    "lint:fix": "eslint ./ --fix"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "devDependencies": {
    // Dependencias de desarrollo
    "babel-core": "^6.26.3",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-config-prettier": "^3.3.0",
    "eslint-plugin-import": "2.14.0",
    "eslint-plugin-jsx-a11y": "6.1.1",
    "eslint-plugin-prettier": "^3.0.0",
    "eslint-plugin-react": "7.11.0",
    "prettier": "^1.15.3",
    "react-app-rewired": "^1.6.2"
  }
}
```

## Ejemplo de _.eslintrc.json_

```
{
    "parser": "babel-eslint",
    "extends": [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    "plugins": [
        "prettier"
    ],
    "rules": {
        "react/jsx-filename-extension": false,
        "react/destructuring-assignment": false,
        "react/no-array-index-key": false,
        "jsx-a11y/no-noninteractive-element-interactions": false,
        "jsx-a11y/click-events-have-key-events": false
    },
    "env": {
        "browser": true,
        "node": true
    }
}
```

## Ejemplo de _.prettierrc.json_

```
{
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid"

}
```

## Ejemplo de _.gitattributes.json_

```
* text=auto eol=lf
```

Este último es necesario ya que prettier / eslint esperan que usemos saltos de linea en nuestros archivos para Linux / Mac y si estamos en Windows el comando de salto de linea es diferente y git lo convertirá al hacer _git add_. Con esta configuración evitamos que lo haga.

# Estándar para proyectos ReactJS

## 1) Proyecto.

Sobre el proyecto.

	A la hora de crear un proyecto se debe utilizar el comando create-react-app my-app. De no poseer el comando instalarlo vía Node Package Manager (NPM) con el comando npm install -g create-react-app.


1.1 Sobre el nombre del proyecto.

	El nombre del proyecto debe estar escrito en minúsculas obligatoriamente y usar guiones para la separación de las palabras, por ejemplo: mi-increible-app, super-app o mega-app.

1.2 Sobre el nombre de las carpetas.

	El nombre de las carpetas debe estar escrito en minúsculas obligatoriamente y usar guiones para la separación de las palabras, por ejemplo: mi-sub-carpeta o carpetita, las carpetas deben comprender un límite mínimo de 3 letras y un límite máximo de 3 palabras y 15 letras.

1.3 Sobre el idioma.

	El código, la documentación, nombre de carpetas, nombre del proyecto, nombre de las clases css, etc. Todo debe estar en Inglés obligatoriamente, a menos que sea un requerimiento específico del cliente o del proyecto realizarlo en español o algún otro idioma que podamos dominar. 


## 2) Carpetas.
Sobre la estructura de carpetas.

### 2.1 General.
Para la estructura de carpetas utilizaremos la estructura base de React para comenzar a armar el proyecto. dicha estructura es la siguiente: 

  * my-app/
    * node_modules/
    * public/
    * src/
    * .gitignore
    * package.json
    * README.md (Este documento)

  Dentro de la carpeta public solo debemos tener el archivo index.html y manifest.json (opcional). Ésta carpeta también la usaremos para guardar todos los recursos (imágenes, fuentes, documentos, archivos de estilo externos, archivos JavaScript externos, etc) en la carpeta assets. 

  Por lo tanto la estructura del proyecto queda de la siguiente manera.
  * my-app/
    * node_modules/
    * public/
      * fonts/
      * images/ 
      * js/ 
      * styles/
      * index.html 
      * manifest.json
    * src/
    * .gitignore
    * package.json
    * README.md (Este documento)

## 2.2 Tamplates.

La carpeta src la usaremos para crear todo el código que utilizaremos dentro de la aplicación, donde la primera subcarpeta que tendremos es la src/templates la misma será utilizada para incluir todos los archivos que serán considerados rutas. Aparte de ésto la carpeta será sub dividida por módulos que requiere la app para obtener una mejor organización. por ejemplo: 
* my-app/
  * node_modules/
  * public/
  * src/
    * templates/
      * access/
      * client/ 
      * company/ 
      * general/
  * .gitignore
  * package.json
  * README.md (Este documento)

En la imagen anterior se muestra una estructura de carpetas dentro de templates con los módulos access en el cual se deben encontrar todas las rutas relacionadas al acceso a la aplicación por ejemplo login, registro, recuperar contraseña, home, etc. esta misma organización debe ser aplicada a los demás módulos. En cada uno de estos módulos debe existir un archivo index.js el cual se utilizará para exportar todos los componentes de su módulo. 

Dentro de la carpeta src/templates debe existir un archivo index.js el cual se utilizará para realizar la configuración y exportar la rutas.

* my-app/
  * node_modules/
  * public/
  * src/
    * templates/
      * access/
      * client/ 
      * company/ 
      * general/
      * index.js
  * .gitignore
  * package.json
  * README.md (Este documento)

## 2.3 Ducks.

Para realizar la integración con un API utilizaremos la propuesta de utilizar redux de una manera modular de erikras/ducks-modular-redux el cual podemos encontrar su documentación en: https://github.com/erikras/ducks-modular-redux, además de eso utilizaremos la mejora de alexnm/re-ducks llamada re-ducks documentado en: https://github.com/alexnm/re-ducks, los cuales proponen una estructura de carpetas la cual su uso será obligatorio. Dicha estructura es la siguiente: 

* duck/
  * actions.js
  * operations.js
  * types.js
  * reducers.js
  * index.js

Según la estructura mostrada en la imagen anterior utilizaremos 8 tipo de archivos de los cuales sólo 5 los cuales son types.js, operations.js, reducers.js, actions.js e index.js. Adicional a esto utilizaremos la estructura de la carpeta src/duck de una manera modular al igual que la carpeta src/templates, por lo tanto los módulos encontrados en src/duck deben ser iguales a src/templates, de esta manera la estructura de nuestro proyecto va quedando de la siguiente manera: 

* my-app/
  * node_modules/
  * public/
  * src/
    * ducks/
      * access/
        * actions.js
        * operations.js
        * types.js
        * reducers.js
        * index.js
      * client/ 
      * company/ 
      * general/
      * index.js
    * templates/
  * .gitignore
  * package.json
  * README.md (Este documento)

Obligatoriamente todas las llamadas al API deben estar dentro del archivo operations.js y ser exportado en el archivo index.js dentro del módulo correspondiente. 

## 3) Librerías de terceros más usadas.

3.1 Librerías de terceros.

Conocer las librerías de terceros es uno de los puntos claves en el desarrollo para poder tener una mejor lectura del código y conocer todas las funcionalidades de las mismas para así evitar usar varias librerías para un mismo fin. A continuación se listaran las librerías más usadas por el equipo y que por este motivo deben ser estudiadas y conocidas en profundidad. 

1.	Material UI: Utilizada para aplicar el estándar de diseño Material Design. https://material-ui.com/
2.	React Icons: Iconos de material icons, fontawesome, ionicons, etc. https://github.com/react-icons/react-icons
3.	Axios: Utilizada para realizar la configuración global y la intersección de llamadas al API. https://github.com/axios/axios
4.	Chart JS: Librería para gráficos básicos. http://www.chartjs.org/docs/latest/
5.	Moment: Utilizada para el manejo eficiente de las fechas. https://momentjs.com/
6.	React Autosuggest : Autocompletador https://github.com/moroshko/react-autosuggest
7.	React Router Dom: Enrutador https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom
8.	Redux: Utilizado para el manejo eficiente del estado de la aplicación. https://github.com/reduxjs/react-redux - https://github.com/rt2zz/redux-persist - https://github.com/reduxjs/redux-thunk - https://github.com/reduxjs/redux

De igual manera es muy importante sentirse libre de buscar otras librerías discutirlas con el grupo sobre su utilidad y luego serán anexadas a este documento de ser necesario. 


