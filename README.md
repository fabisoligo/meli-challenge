# Challenge Mercado Libre (Front End)

Dado el [enunciado](https://github.com/fabisoligo/meli-challenge/blob/master/Front-End%20Test%20Pr%C3%A1ctico.pdf), se busca resolver el problema utilizando una web app construída con Angular 9, deployada en un servidor Node implementado con el framework Express y que añade una capa REST para realizar las peticiones HTTP del contenido alojado en https://api.mercadolibre.com.  
Se implementa la solución de Server Side Rendering provee Angular Universal que nos permite la renderización del contenido desde el servidor para poder mejorar el SEO de nuestro contenido.  
Para facilitar el manejo del estado de la aplicación se utiliza la librería NGXS, hidratándolo en los casos que corresponden con los datos obtenidos del server side rendering para no duplicar las peticiones HTTP.  
Además, se utiliza TailwindCSS que brinda clases para utilizar sobre el html, añandiendo propiedades de CSS específicas y con medidas estandarizadas para lograr una coherencia en el diseño del proyecto.

***Desarrollado por Fabián Soligo.***



### Las tecnologías utilizadas fueron:
* **Angular 9.0.2** *Web APP*
* **Angular Universal 9.0.2** *Server Side Rendering*
* **NGXS** *Manejo del estado de la aplicaciòn*
* **Node 12.16.1** *Servidor*
* **Express 4.15.2**  *API*
* **TailwindCSS 1.3.5** *Framework CSS*



### Dependencias

* Node
* NPM

### Instalación

_Clonar el Repositorio_
```
git clone git@github.com:fabisoligo/meli-challenge.git
```

_Entrar en la carpeta del proyecto_
```
cd meli-challenge
```

_Instalar las dependencias_
```
npm i
```


_Iniciar la aplicación_
```
npm start
```


_¡Listo! Arbir el siguiente [enlace](http://localhost:4040) en tu navegador._