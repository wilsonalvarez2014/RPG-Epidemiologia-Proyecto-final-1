/*:
 * @plugindesc [v2.0] QUIZ de Letalidad General y Especifica
 * @author Luis
 * 
 * @param VariablePuntaje
 * @text Variable de Puntaje
 * @type variable
 * @desc ID 146
 * @default 10 id 173
 *
 * @param VariableIntentos
 * @text Variable de Intentos
 * @type variable
 * @desc ID 147
 * @default 10 id 174
 *
 * @help
 * Comando de evento para activar el quiz:
 *     IniciarLetalidad
 * 
 * Metodo Validacion QUIZ Termnado 
 *      $gameSystem.juegoCompletadoLetalidad()
 */

(function() {


    // Propiedades globales
    Object.defineProperty(window, 'letalidad', {
        get: function() {
            return $gameVariables.value(173);
        },
        set: function(valor) {
            $gameVariables.setValue(173, valor);
        }
    });

    //let _puntajeTotal = 0;
    //let _juegoTerminado = false;
    let _finalScore = 175; // puntaje final a comulado
    
    // Extensiones del sistema
    Game_System.prototype.juegoCompletadoLetalidad = function() {
        return this._juegoCompleto22Letalidad === true;
    };

    Game_System.prototype.establecerjuegoCompletadoLetalidad = function(estado12) {
        this._juegoCompleto22Letalidad = estado12;
    };

    Game_System.prototype.juegoBloqueadoLetalidad = function() {
        return this._juegoBloqueado22Letalidad === true;
    };

    Game_System.prototype.establecerBloqueoLetalidad = function(estado23) {
        this._juegoBloqueado22Letalidad = estado23;
    };

    // Comando del plugin
    //const _comandoOriginal = Game_Interpreter.prototype.pluginCommand;
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(comando, args) {
        _Game_Interpreter_pluginCommand.call(this, comando, args);
        //_comandoOriginal.call(this, comando, args);
        
        if (comando === "IniciarLetalidad") {
            if ($gameSystem.lrmzJuegoBloqueadoLetalidad()) {
                SceneManager.push(Scene_LRMZ_BloqueoFinalLetalidad);
                return;
            }
            
            if ($gameSystem.juegoCompletadoLetalidad()) {
                alert("Ya completaste este desafío con la máxima puntuación.");
                return;
            }
            // variable contador 2
            if ($gameVariables.value(174) === 0) {
                $gameVariables.setValue(174, 10) 
            }
            //establecer variable de juego
            if ($gameVariables.value(173) === 0) {
                $gameVariables.setValue(173, 10);
                
            }

            SceneManager.push(Escene_MTTTT);
        }
    };

    // Escena principal del minijuego
    function Escene_MTTTT() {
        this.initialize.apply(this, arguments);
    }

    Escene_MTTTT.prototype = Object.create(Scene_Base.prototype);
    Escene_MTTTT.prototype.constructor = Escene_MTTTT;

    Escene_MTTTT.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Escene_MTTTT.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        Input.clear();
        TouchInput.clear();
    };

    Escene_MTTTT.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        
        this.crearFondo();
        this.crearElementosDeTexto();
        this.crearElementosArrastrables();
        this.crearCajasDestino();
        //this.crearBotonAyuda();
        this.crearBotonesInferiores();
        //this.crearPanelPuntaje();
        //this.crearPanelPuntajeTotal();
        this.createScoreBox();
        this.createFinalScoreBox();
        this.createConsultaButton();
         this.createInfoButton();
        //this.openConsultaWindow();
        

    };

    // Métodos de la escena
    Escene_MTTTT.prototype.crearFondo = function() {
        this._fondo = new Sprite();
        const imagenFondo = ImageManager.loadBitmap('img/img_pluging/', 'letalidad')
        
        imagenFondo.addLoadListener(() => {
            this._fondo.bitmap = imagenFondo;
            this._fondo.scale.x = Graphics.width / imagenFondo.width;
            this._fondo.scale.y = Graphics.height / imagenFondo.height;
        });
        
        this.addChild(this._fondo);
    };



 








  
  
  
  //METODOS DEL PLUGING

 

  //funcion mostrar mas informacion 
  Escene_MTTTT.prototype.createInfoButton = function() {
  const buttonWidth = 150;
  const buttonHeight = 43;
  const buttonX = 50; 
  const buttonY = 95;

  // Crear el botón
  const infoButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  infoButton._normalColor = '#dedadaff';
  infoButton._hoverColor = '#b1d5faff';
  infoButton._textColor = '#3a3939ff';
  infoButton._isHovered = false;

  const drawButton = (bgColor, textColor) => {
    infoButton.bitmap.clear();
    infoButton.bitmap.fillRect(0, 5, buttonWidth, buttonHeight, bgColor);
    infoButton.bitmap.fontSize =18;
    infoButton.bitmap.textColor = textColor;
    infoButton.bitmap.fontFace = 'Arial';
    infoButton.bitmap.outlineWidth = 0;
    //infoButton.bitmap.textColor = "#000000";
    infoButton.bitmap.drawText("Mas Información", 5, 5, buttonWidth, buttonHeight, 'left');
  };

  drawButton(infoButton._normalColor, infoButton._textColor);

  infoButton.x = buttonX;
  infoButton.y = buttonY;

  // Crear el cuadro de texto emergente
  const tooltip = new Sprite(new Bitmap(450, 200));
  const bmp = tooltip.bitmap;
  bmp.outlineColor = 'rgba(0, 0, 0, 0)'; // Sin color de contorno
  bmp.outlineWidth = 0;                 // Ancho del contorno = 0


  tooltip.bitmap.textColor = "#000000";
  tooltip.bitmap.fillRect(0, 0, 390, 130, "#ffffe0"); // fondo amarillo claro
  //tooltip.bitmap.textColor = "#000000";
  tooltip.bitmap.fontSize = 15; //  tamaño del texto

const lines = [
  "Puedes hacer clic en Referencias",
  "o en salir sin finalizar",
  "para consultar tus notas de estudio,",
  "diario de campo u otros documentos",
  "que te permitan tener más certeza en tu respuesta."
];

for (let i = 0; i < lines.length; i++) {
  tooltip.bitmap.drawText(lines[i], 10, i * 22, 430, 30, 'left');
}
  tooltip.x = infoButton.x + buttonWidth + 20;
  tooltip.y = infoButton.y;
  tooltip.visible = false;

  // Lógica de interacción
  infoButton.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    const hovered = (
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    );

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawButton(hovered ? this._hoverColor : this._normalColor, this._textColor);
      tooltip.visible = hovered;
    }
  };

  this.addChild(infoButton);
  this.addChild(tooltip);
};

//metod del boton de enlaces
  Escene_MTTTT.prototype.createConsultaButton = function() {
  const buttonX = 225;  
  const buttonY = 100;  
  const buttonWidth = 115;
  const buttonHeight = 40;

  const button = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  button._normalColor = '#dcdcdfff';    
  button._hoverColor = '#b8dbfaff';     
  button._textColor = '#353434ff';      

  button._isHovered = false;

  //  Estilo inicial
  const drawButton = (bgColor, textColor) => {
    button.bitmap.clear();

    // Fondo con esquinas redondeadas simuladas
    button.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, bgColor);
    button.bitmap.textColor = textColor;
    button.bitmap.fontFace = 'Arial';
    button.bitmap.outlineWidth = 0;
    button.bitmap.fontSize =18;
    button.bitmap.drawText("Referencias", 5, 5, buttonWidth, buttonHeight, 'left');

    // Simulación de bordes redondeados: sombra
    button.bitmap.gradientFillRect(0, buttonHeight - 4, buttonWidth, 4, "#00000044", "#00000000", true);
  };

  drawButton(button._normalColor, button._textColor);

  button.x = buttonX;
  button.y = buttonY;

  // Manejador de clic
  button.setClickHandler = () => {
    this.openConsultaWindow();
  };

  // Manejo visual y de interacción
  button.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    const hovered = (
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    );

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawButton(
        hovered ? this._hoverColor : this._normalColor,
        this._textColor
      );
    }

    if (TouchInput.isTriggered() && hovered) {
      this.setClickHandler();
    }
  };

  this._consultaButton = button;
  this.addChild(button);
};




  //funcion mostrar puntaje de la tarea 2
  Escene_MTTTT.prototype.createFinalScoreBox = function() {
  const finalScoreBox = new Sprite(new Bitmap(300, 40));
  finalScoreBox.x = 599;  // Cambiar la posición
  finalScoreBox.y = 100;

  finalScoreBox.bitmap.fillRect(0, 0, 190, 40, "#f5d1b4ff"); 
  finalScoreBox.bitmap.textColor = "#000000";
  finalScoreBox.bitmap.fontFace = 'Arial';
  finalScoreBox.bitmap.outlineWidth = 0;
  const vida3 = $gameVariables.value(160);
  finalScoreBox.bitmap.fontSize =18;
  finalScoreBox.bitmap.drawText("Puntaje Tarea 3: " + vida3, 5, 5, 250, 40, 'left');

  this._finalScoreBox = finalScoreBox;
  this.addChild(finalScoreBox);
};

    //Mostrar el puntaje en pantalla
  Escene_MTTTT.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 100;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + letalidad, 5, 5, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};
Escene_MTTTT.prototype.openConsultaWindow = function() {
  if (this._consultaWindow) {
    this.removeChild(this._consultaWindow);
    this._consultaWindow = null;
    return;
  }

  const width = 500;
  const height = 300;
  const windowSprite = new Sprite(new Bitmap(width, height));
  windowSprite.bitmap.fillRect(0, 0, width, height, '#f1f3f4ff');
  windowSprite.x = (Graphics.width - width) / 2;
  windowSprite.y = (Graphics.height - height) / 2;

  // Crear botón de cerrar [X]
  const closeButton = new Sprite(new Bitmap(40, 40));
  closeButton.bitmap.fillRect(0, 0, 40, 40, '#ff4444');
  closeButton.bitmap.drawText("X", 0, 0, 40, 40, 'center');
  closeButton.x = width - 45;
  closeButton.y = 5;

  closeButton.update = function() {
    Sprite.prototype.update.call(this);
    if (TouchInput.isTriggered()) {
      const x = TouchInput.x;
      const y = TouchInput.y;
      const globalX = windowSprite.x + this.x;
      const globalY = windowSprite.y + this.y;
      if (x >= globalX && x <= globalX + this.width &&
          y >= globalY && y <= globalY + this.height) {
        SceneManager._scene.removeChild(windowSprite);
        SceneManager._scene._consultaWindow = null;
      }
    }
  };

  windowSprite.addChild(closeButton);


  const links = [
    { label: "Video explicación", url: "https://www.youtube.com/watch?v=zCcxZvmjnw0" }
    // agregar más enlaces aquí
  ];

  links.forEach((link, index) => {
      const linkWidth = width - 20;
  const linkHeight = 40;
  const linkSprite = new Sprite(new Bitmap(linkWidth, linkHeight));

  linkSprite._url = link.url;
  linkSprite._label = link.label;
  linkSprite._normalColor = "#070707ff";   
  linkSprite._hoverColor = "#a5cef7ff";    
  linkSprite._isHovered = false;

  //  Dibujar el texto del enlace
  const drawLink = (color) => {
    linkSprite.bitmap.clear();
    linkSprite.bitmap.textColor = color;
    linkSprite.bitmap.drawText(link.label, 0, 0, linkWidth, linkHeight, 'left');
  };

  drawLink(linkSprite._normalColor);

  linkSprite.x = 10;
  linkSprite.y = 50 + index * 45;

  // Detectar hover y clic
  linkSprite.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;
    const globalX = windowSprite.x + this.x;
    const globalY = windowSprite.y + this.y;

    const hovered =
      x >= globalX && x <= globalX + this.width &&
      y >= globalY && y <= globalY + this.height;

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawLink(hovered ? this._hoverColor : this._normalColor);
    }

    if (TouchInput.isTriggered() && hovered) {
      window.open(this._url, '_blank');
    }
  };

  windowSprite.addChild(linkSprite);
  });

  this._consultaWindow = windowSprite;
  this.addChild(windowSprite);
};
























      Escene_MTTTT.prototype.updateDragAndDrop = function() {
      // Fase 1: Iniciar arrastre
      if (TouchInput.isTriggered()) {
          for (const elemento of this._elementos) {
              const x = TouchInput.x;
              const y = TouchInput.y;
              
              if (x >= elemento.x && x <= elemento.x + elemento.width &&
                  y >= elemento.y && y <= elemento.y + elemento.height) {
                  this._elementoArrastrado = elemento;
                  elemento._arrastrando = true;
                  
                  // Efecto visual al seleccionar
                  elemento.scale.x = 1.1;
                  elemento.scale.y = 1.1;
                  SoundManager.playCursor();
                  break;
              }
          }
      }

      // Fase 2: Mover elemento arrastrado
      if (TouchInput.isPressed() && this._elementoArrastrado) {
          const elemento = this._elementoArrastrado;
          elemento.x = TouchInput.x - elemento.width / 2;
          elemento.y = TouchInput.y - elemento.height / 2;
          
          // Resaltar cajas válidas durante el arrastre
          this.resaltarCajasValidas(elemento._valor);
      } else {
          this.resetearResaltadoCajas();
      }

      // Fase 3: Soltar elemento
      if (TouchInput.isReleased() && this._elementoArrastrado) {
          const elemento = this._elementoArrastrado;
          elemento._arrastrando = false;
          elemento.scale.x = 1.0;
          elemento.scale.y = 1.0;
          
          // Intenta soltar en una caja válida
          this.tryDrop(elemento);
          
          this.resetearResaltadoCajas();
          this._elementoArrastrado = null;
      }
  };

  // Métodos auxiliares para el drag and drop
  Escene_MTTTT.prototype.resaltarCajasValidas = function(valor) {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              // Resaltar todas las cajas vacías (o añadir lógica específica)
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, 'rgba(100, 255, 100, 0.3)');
              //caja.bitmap.drawText(caja._respuestaCorrecta, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  Escene_MTTTT.prototype.resetearResaltadoCajas = function() {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, '#ffffffff');//Color de la caja
              //caja.bitmap.drawText(`Caja ${this._cajas.indexOf(caja)+1}`, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  // Actualizar en el método principal update
  Escene_MTTTT.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.updateDragAndDrop();
      
      if (Input.isTriggered('cancel')) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };








Escene_MTTTT.prototype.crearElementosDeTexto = function() {
  this._elementos = [];
        
const variables = ['Municipio Santa María', 'Dengue', 'Fiebre Amarilla', 'Accidente ofídico','Intoxicación por plaguicidas','Enfermedad desconocida'];
        const posicionesParaLasCajas = [
            {x: 80, y: 230}, //{x: 340, y: 210}, //{x: 425, y: 210},
            //{x: 510, y: 210}, 
            {x: 80, y: 360},
            {x: 80, y: 400}, {x: 80, y: 430}, {x: 80, y: 475}, {x: 80, y: 525}
        ];

        const medidasParaLasCajas = [
            {w: 160, h: 40}, // 
            {w: 160, h: 40},  // 
            {w: 160, h: 40}, // 
            {w: 160, h: 40},  //
            {w: 230, h: 40},  // 
            {w: 200, h: 40},  // 
            //{w: 180, h: 40},  // 
            //{w: 100, h: 40},
           // {w: 100, h: 40}
];

    for (let i = 0; i < variables.length; i++) {
    const valor = variables[i];
    const pos = posicionesParaLasCajas[i];
    const medida = medidasParaLasCajas[i];

    const texto = new Sprite(new Bitmap(medida.w, medida.h));
    texto.bitmap.fontSize = 15;
    texto.bitmap.fontFace = 'Arial';
    texto.bitmap._context.font = `bold ${texto.bitmap.fontSize}px ${texto.bitmap.fontFace}`;
    texto.bitmap.outlineWidth = 0;
    texto.bitmap.outlineColor = 'rgba(0,0,0,0)';
    texto.bitmap.textColor = "#0b0b0bff";

    const ctx = texto.bitmap._context;
    const palabras = valor.split(' ');
    const lineas = [];
    let lineaActual = '';

    for (let palabra of palabras) {
        const testLinea = lineaActual.length > 0 ? lineaActual + ' ' + palabra : palabra;
        const anchoTest = ctx.measureText(testLinea).width;

        if (anchoTest <= medida.w) {
            lineaActual = testLinea;
        } else {
            lineas.push(lineaActual);
            lineaActual = palabra;
        }
    }

    if (lineaActual.length > 0) {
        lineas.push(lineaActual);
    }

    const lineHeight = texto.bitmap.fontSize + 2;

    for (let j = 0; j < lineas.length; j++) {
        texto.bitmap.drawText(lineas[j], 0, j * lineHeight, medida.w, lineHeight, 'left');
    }

    texto.x = pos.x;
    texto.y = pos.y;
    texto._posicionInicial = {x: pos.x, y: pos.y};
    texto._valor = valor;
    texto._arrastrando = false;

    this._elementos.push(texto);
    this.addChild(texto);
}

    };


















    Escene_MTTTT.prototype.crearElementosArrastrables = function() {
        this._elementos = [];
        
        const valores = ['0,0', '38,5', '16,7', '21,4', '25,0', '20,0'];
        const posiciones = [
            {x: 680, y: 258}, {x: 680, y: 293}, {x: 680, y: 325},
            {x: 680, y: 358}, {x: 680, y: 393}, {x: 680, y: 428},
            //{x: 690, y: 490}, {x: 690, y: 520}, {x: 690, y: 550},
            
        ];

        const medidas = [
            {w: 50, h: 30}, // 
            {w: 50, h: 30},  // 
            {w: 50, h: 30}, // 
            {w: 50, h: 30},  //
            {w: 50, h: 30},  // 
            {w: 50, h: 30},  // 
            {w: 50, h: 30},  // 
            {w: 50, h: 30}, //
            {w: 50, h: 30}  // 
            
];

    for (let i = 0; i < valores.length; i++) {
        const valor = valores[i];
        const pos = posiciones[i];
        const medida = medidas[i]; //Acceder al ancho y alto específico

        const elemento = new Sprite(new Bitmap(medida.w, medida.h));
        elemento.bitmap.fontSize = 17;
        elemento.bitmap.fontFace = 'Arial';
        elemento.bitmap.outlineWidth = 0;
        elemento.bitmap.outlineColor = 'rgba(0,0,0,0)';
        elemento.bitmap.textColor = "#0b0b0bff";
        elemento.bitmap.drawText(valor, 0, 0, medida.w, medida.h, 'left');

        elemento.x = pos.x;
        elemento.y = pos.y;
        elemento._posicionInicial = {x: pos.x, y: pos.y};
        elemento._valor = valor;
        elemento._arrastrando = false;

        this._elementos.push(elemento);
        this.addChild(elemento);
    }

    };

    Escene_MTTTT.prototype.crearCajasDestino = function() {
        this._cajas = [];
        
        //const respuestasCorrectas = [
        //    'Cuantitativa', 'Discreta', 'Grados centigrados', 'No aplica', 'Parcial', 'Años', 'Nominal', 'Si', 'Porcentaje', 'Ordinal', 'Continua', 'No', 'Sano', 'Persona', "Cualitativa", "Enfermo",
        //];
        
        const posicionesCajas = [
            // Columna 1
            {x: 325, y: 230 }, {x: 325, y: 357}, {x: 325, y: 393},
            
            // Columna 2
            {x: 325, y: 427}, {x: 325, y: 475}, {x: 325, y: 525},
            
            //Columna 3
            //{x: 498, y: 275}, {x: 498, y: 340}, {x: 498, y: 415},
           
        ];
        

        for (let i = 0; i < 6; i++) {
            const caja = new Sprite(new Bitmap(71, 25));
            caja.bitmap.fillRect(0, 0, 50, 5, '#f28e8eff');
            caja.bitmap.fontSize = 12; // Ajusta según necesidad
            caja.bitmap.drawText(`Suelta ${i+1}`, 0, 0, 70, 5, 'center');
            
            caja.x = posicionesCajas[i].x;
            caja.y = posicionesCajas[i].y;
            //caja._respuestaCorrecta = respuestasCorrectas[i];
            caja._valorActual = null;
            caja._ocupada = false;
            
            this._cajas.push(caja);
            this.addChild(caja);
        }
    };


    Escene_MTTTT.prototype.getBoxGroups = function() {
    return [
        ['21,4'],    // caja 1
        ['20,0'],    // caja 2
        ['16,7'],     // caja 3
        ['25,0'],     // caja 4
        ['0,0'],    // caja 5
        ['38,5'],     // caja 6
        //['27'],     // caja 7
        //['38,4'], // caja 8
        //['3']       // caja 9
    ]
};


      Escene_MTTTT.prototype.crearBotonesInferiores = function() {
      const anchoBoton = 180;
      const altoBoton = 40;
      const self = this;

      // Botón "Cancelar"
      const botonCancelar = new Sprite(new Bitmap(anchoBoton, altoBoton));
      botonCancelar.bitmap.fillRect(0, 0, anchoBoton, altoBoton, '#e74c3c');
      botonCancelar.bitmap.textColor = '#100d0dff';
      botonCancelar.bitmap.fontFace = 'Arial';
      botonCancelar.bitmap.outlineWidth = 0;
      botonCancelar.bitmap.drawText("Cancelar", 0, 0, anchoBoton, altoBoton, 'center');
      botonCancelar.x = Graphics.width / 2 - anchoBoton - 20;
      botonCancelar.y = Graphics.height - altoBoton - 7;

      botonCancelar.update = function() {
          Sprite.prototype.update.call(this);
          if (TouchInput.isTriggered() && this.esClicEnBoton()) {
              SoundManager.playCancel();
              SceneManager.pop();
          }
      };

      // Botón "Validar"
      const botonValidar = new Sprite(new Bitmap(anchoBoton, altoBoton));
      botonValidar.bitmap.fillRect(0, 0, anchoBoton, altoBoton, '#2ecc71');
      botonValidar.bitmap.textColor = '#070606ff';
      botonValidar.bitmap.fontFace = 'Arial';
      botonValidar.bitmap.outlineWidth = 0;
      botonValidar.bitmap.drawText("Validar Respuestas", 0, 0, anchoBoton, altoBoton, 'center');
      botonValidar.x = Graphics.width / 2 + 20;
      botonValidar.y = Graphics.height - altoBoton - 7;

      
      botonValidar.update = function() {
        Sprite.prototype.update.call(this);
        const x = TouchInput.x;
        const y = TouchInput.y;
          if (TouchInput.isTriggered()) {
            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                const isValid = self.checkAllAnswers(); 

                if (isValid) {
                _finalScore += letalidad;
                const currentvida = $gameVariables.value(160);
                $gameVariables.setValue(160, currentvida + letalidad);
                $gameSystem.establecerjuegoCompletadoLetalidad(true);
                //Refrescar visualmente
                SceneManager._scene._finalScoreBox.bitmap.clear();
                SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
                SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
                SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
                alert("✅ Prueba correcta. Se sumaron " + letalidad + " puntos al resultado final.");
                } else {
                    //validar el contador 2
                $gameVariables.setValue(174, $gameVariables.value(174) - 1);
                letalidad = Math.max(0, letalidad - 1);
                // Verificar si se acabaron los intentos
                if (letalidad <= 0 || $gameVariables.value(174) <= 0) {
                   $gameSystem.setlrmzJuegoBloqueadoLetalidad(true);
                   SceneManager.push(Scene_LRMZ_BloqueoFinalLetalidad);
                   return;
                 }
                alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + letalidad);
                if (letalidad === 5) {
                    alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
                    
                }
                
                }

            // Refrescar el texto del puntaje
            //if (self._scoreBox) {

            //  self._scoreBox.bitmap.clear();
            //  self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
            //  self._scoreBox.bitmap.textColor = "#000000";
            //  self._scoreBox.bitmap.drawText("Puntaje: " + _internalScore, 0, 0, 250, 40, 'left');
            
            //}
            

            SceneManager.pop();

        }
        }
      };

      // Añadir método auxiliar para detección de clics
      Sprite.prototype.esClicEnBoton = function() {
          const x = TouchInput.x;
          const y = TouchInput.y;
          return x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height;
      };

      this.addChild(botonCancelar);
      this.addChild(botonValidar);
  };


    // Métodos como validarRespuestas, manejarArrastre, etc.

    Escene_MTTTT.prototype.validarRespuestas = function() {
        for (let i = 0; i < this._cajas.length; i++) {
            const caja = this._cajas[i];
            if (!caja._ocupada || caja._valorActual !== caja._respuestaCorrecta) {
                return false;
            }
        }
        return true;
    };








      Escene_MTTTT.prototype.tryDrop = function(elementoArrastrable) {
      let soltadoEnCaja = false;
      const margenError = 30; // Pixeles de tolerancia para el área de soltar

      // Verificar colisión con cada caja
      for (const caja of this._cajas) {
          const dentroDeCaja = (
              elementoArrastrable.x + margenError >= caja.x &&
              elementoArrastrable.x + elementoArrastrable.width - margenError <= caja.x + caja.width &&
              elementoArrastrable.y + margenError >= caja.y &&
              elementoArrastrable.y + elementoArrastrable.height - margenError <= caja.y + caja.height
          );

          if (dentroDeCaja) {
              // Asignar el valor a la caja
              caja._valorActual = elementoArrastrable._valor;
              caja._ocupada = true;
              this.checkAllAnswers();
              
              // Actualizar gráfico de la caja
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, this.obtenerColorSegunTipo(elementoArrastrable._valor));
              //caja.bitmap.fontSize = elementoArrastrable._valor.includes('%') ? 18 : 22;
              caja.bitmap.fontSize = 12;
              caja.bitmap.fontFace = 'Arial'; // Más fina que la predeterminada
              caja.bitmap.outlineWidth = 0;
              caja.bitmap.outlineColor = 'rgba(0,0,0,0)';

              caja.bitmap.textColor = '#0b0b0bff';
              caja.bitmap.drawText(elementoArrastrable._valor, 0, 0, caja.width, caja.height, 'center');
              
              // Efecto visual
              this.crearEfectoSoltado(caja.x, caja.y);
              SoundManager.playEquip();
              
              soltadoEnCaja = true;
              break;
          }
      }

      // Resetear posición si no se soltó en caja válida
      if (!soltadoEnCaja) {
          elementoArrastrable.x = elementoArrastrable._posicionInicial.x;
          elementoArrastrable.y = elementoArrastrable._posicionInicial.y;
          SoundManager.playBuzzer();
      } else {
          // Devolver elemento a su posición original
          elementoArrastrable.x = elementoArrastrable._posicionInicial.x;
          elementoArrastrable.y = elementoArrastrable._posicionInicial.y;
      }
  };

  // Métodos auxiliares para tryDrop
  Escene_MTTTT.prototype.obtenerColorSegunTipo = function(valor) {
      // Colores diferentes para números vs porcentajes
      return valor.includes('%') ? '#f2f4f6ff' : '#fbf9f8ff'; //color al soltar
  };

  Escene_MTTTT.prototype.crearEfectoSoltado = function(x, y) {
      const efecto = new Sprite(new Bitmap(80, 50));
      efecto.bitmap.fillRect(0, 0, 80, 50, 'rgba(204, 214, 128, 0.5)');
      efecto.x = x;
      efecto.y = y;
      efecto.opacity = 0;
      
      this.addChild(efecto);
      
      // Animación de fade
      //efecto.fadeIn(30, () => {
          //efecto.fadeOut(30, () => {
              //this.removeChild(efecto);
          //});
      //});
  };

  //Metodo de validacion 
  Escene_MTTTT.prototype.checkAllAnswers = function() {
    function normalizeText(s) {
        s = s == null ? '' : String(s);
        s = s.replace(/[\u200B-\u200D\uFEFF]/g, '')
             .replace(/\u00A0/g, ' ')
             .replace(/[\r\n]+/g, ' ')
             .replace(/\s+/g, ' ')
             .trim()
             .toLowerCase();
        if (s.normalize) {
            s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return s;
    }

    var faltantes = [];
    for (var i = 0; i < this._cajas.length; i++) {
        if (!this._cajas[i] || !this._cajas[i]._ocupada) faltantes.push(i + 1);
    }
    if (faltantes.length) {
        console.log("⚠️ Cajas sin llenar:", faltantes);
        return false;
    }

    var expectedValues = this.getBoxGroups();
    var errores = [];

    for (var i = 0; i < this._cajas.length; i++) {
        var box = this._cajas[i];
        var validOptionsRaw = expectedValues[i] || [];
        var actual = String(box._valorActual || '').trim();
        var normalizedActual = normalizeText(actual);

        // 1️⃣ Comparación directa
        var matched = false;
        for (var j = 0; j < validOptionsRaw.length; j++) {
            if (normalizeText(validOptionsRaw[j]) === normalizedActual) {
                matched = true;
                break;
            }
        }

        // 2️⃣ Si no coincide directo, probar separando por coma/pipe/slash
        if (!matched) {
            var normalizedOptions = [];
            for (var j = 0; j < validOptionsRaw.length; j++) {
                var parts = String(validOptionsRaw[j]).split(/[,\|\/;]/);
                for (var k = 0; k < parts.length; k++) {
                    normalizedOptions.push(normalizeText(parts[k]));
                }
            }
            if (normalizedOptions.indexOf(normalizedActual) !== -1) {
                matched = true;
            }
        }

        // 3️⃣ Fallback: comparación numérica
        if (!matched) {
            var nActualNum = parseFloat(normalizedActual.replace(',', '.'));
            if (!isNaN(nActualNum)) {
                for (var m = 0; m < validOptionsRaw.length && !matched; m++) {
                    var numParts = String(validOptionsRaw[m]).split(/[,\|\/;]/);
                    for (var n = 0; n < numParts.length && !matched; n++) {
                        var optNum = parseFloat(numParts[n].replace(',', '.'));
                        if (!isNaN(optNum) && Math.abs(optNum - nActualNum) < 1e-9) {
                            matched = true;
                        }
                    }
                }
            }
        }

        if (!matched) {
            errores.push({
                caja: i + 1,
                ingresadoRaw: actual,
                normalizadoIngresado: normalizedActual,
                esperadoRaw: validOptionsRaw
            });
        }
    }

    if (errores.length) {
        console.log("❌ Respuestas incorrectas (detalle):", errores);
        return false;
    }

    console.log("✅ Todas las respuestas son correctas");
    return true;
};

  
















 function Scene_LRMZ_BloqueoFinalLetalidad() {
  this.initialize.apply(this, arguments);
}

Scene_LRMZ_BloqueoFinalLetalidad.prototype = Object.create(Scene_Base.prototype);
Scene_LRMZ_BloqueoFinalLetalidad.prototype.constructor = Scene_LRMZ_BloqueoFinalLetalidad;

Scene_LRMZ_BloqueoFinalLetalidad.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_LRMZ_BloqueoFinalLetalidad.prototype.create = function() {
  Scene_Base.prototype.create.call(this);

  // Imagen de fondo
  this._lrmzFondo = new Sprite();
  const bitmapFondo = ImageManager.loadBitmap('img/img_pluging/', 'letalidad retro', false);
  bitmapFondo.addLoadListener(() => {
    this._lrmzFondo.bitmap = bitmapFondo;
    this._lrmzFondo.scale.x = Graphics.width / bitmapFondo.width;
    this._lrmzFondo.scale.y = Graphics.height / bitmapFondo.height;
  });
  this.addChild(this._lrmzFondo);

  // Panel central
  const panelAncho = 500;
  const panelAlto = 250;
  this._lrmzPanel = new Sprite(new Bitmap(panelAncho, panelAlto));
  this._lrmzPanel.bitmap.fontSize = 24;
  this._lrmzPanel.x = (Graphics.width - panelAncho) / 2;
  this._lrmzPanel.y = (Graphics.height - panelAlto) / 2;
  this.addChild(this._lrmzPanel);

  // Botón de cerrar
  const botonAncho = 150;
  const botonAlto = 40;
  this._lrmzBotonCerrar = new Sprite(new Bitmap(botonAncho, botonAlto));
  this._lrmzBotonCerrar.bitmap.fillRect(0, 0, botonAncho, botonAlto, '#e74c3c');
  this._lrmzBotonCerrar.bitmap.drawText("Cerrar", 0, 0, botonAncho, botonAlto, 'center');
  this._lrmzBotonCerrar.x = (Graphics.width - botonAncho) / 2;
  this._lrmzBotonCerrar.y = this._lrmzPanel.y + panelAlto - botonAlto + 175;

  this._lrmzBotonCerrar.update = function() {
    Sprite.prototype.update.call(this);
    if (TouchInput.isTriggered() &&
        TouchInput.x >= this.x && TouchInput.x <= this.x + this.width &&
        TouchInput.y >= this.y && TouchInput.y <= this.y + this.height) {
      SceneManager.goto(Scene_Map);
    }
  };

  this.addChild(this._lrmzBotonCerrar);
};

// Guardar el estado de bloqueo
const _LRMZ_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = _LRMZ_DataManager_makeSaveContents.call(this);
  contents.letalidad = letalidad;
  contents._finalScore = _finalScore;
  contents._lrmzJuegoBloqueadoLetalidad = $gameSystem.lrmzJuegoBloqueadoLetalidad();
  return contents;
};

// Cargar el estado de bloqueo
const _LRMZ_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  _LRMZ_DataManager_extractSaveContents.call(this, contents);
  letalidad = contents.letalidad || 0;
  _finalScore = contents._finalScore || 0;
  $gameSystem.setlrmzJuegoBloqueadoLetalidad(contents._lrmzJuegoBloqueadoLetalidad || false);
};

// Métodos de acceso para el bloqueo
Game_System.prototype.lrmzJuegoBloqueadoLetalidad = function() {
  return this._lrmzJuegoBloqueadoLetalidad || false;
};

Game_System.prototype.setlrmzJuegoBloqueadoLetalidad = function(valor) {
  this._lrmzJuegoBloqueadoLetalidad = valor;
};

})();