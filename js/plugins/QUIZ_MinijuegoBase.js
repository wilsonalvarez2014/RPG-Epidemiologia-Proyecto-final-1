/*:
 * @plugindesc [v1.0] Minijuego base con comando de activación desde evento. 
 * @author Luis
 *
 * @help
 * Comando de evento para activar el minijuego:
 *     StartMiniGame
 *
 * 
 */
const PUNTAJE_INICIAL = 10;

(function() {
    //funcion para comando de pluging
  Object.defineProperty(window, '_internalScore', {
    get: function() {
      return $gameVariables.value(3);
    },
    set: function(value) {
      $gameVariables.setValue(3, value);
    }
});

  let _finalScore = 175; // puntaje final a comulado
  let _gamePassed = false; 
  
           

  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  
    // Extiende Game_System para guardar si ya pasó la prueba
  Game_System.prototype.hasPassedMiniGame = function() {
    return this._miniGamePassed === true;
  };

  Game_System.prototype.setPassedMiniGame = function(passed) {
    this._miniGamePassed = passed;
  };

  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    $gameSystem._internalScore = (!$gameSystem._internalScore) ? PUNTAJE_INICIAL : $gameSystem._internalScore;
    //funcion para comando de pluging
    if (command === "StartMiniGame") {
      if ($gameSystem.hasPassedMiniGame()) {
        alert("⚠️ Ya no puedes volver a presentar la prueba. Ya sacaste el mayor puntaje.");
        return;
      }
      

      if ($gameVariables.value(3) === 0) {
        $gameVariables.setValue(3, 10);
      }

      SceneManager.push(Scene_MiniGame);
   }

  };
//funcion para comando de pluging
  function Scene_MiniGame() {
    this.initialize.apply(this, arguments);
  }

  
//funcion para comando de pluging
  Scene_MiniGame.prototype = Object.create(Scene_Base.prototype);
  Scene_MiniGame.prototype.constructor = Scene_MiniGame;
//funcion para comando de pluging
  Scene_MiniGame.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };
//funcion para ejecutar las funciones
  Scene_MiniGame.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    
    this.createImageWindow();
    this.createDraggableNumbers();
    this.createDropBoxes();
    this.createConsultaButton();
    this.createBottomButtons();
    this.createScoreBox();
    this.createFinalScoreBox();
    this.createInfoButton();

  };
  //funcion para comando de pluging
  Scene_MiniGame.prototype.update = function() {
  Scene_Base.prototype.update.call(this);
  this.updateDragAndDrop();

  if (Input.isTriggered('cancel')) {
    SceneManager.pop();
  }
};

Scene_MiniGame.prototype.updateDragAndDrop = function() {
  if (TouchInput.isTriggered()) {
    for (let sprite of this._draggableNumbers) {
      const x = TouchInput.x;
      const y = TouchInput.y;
      if (x >= sprite.x && x <= sprite.x + sprite.width &&
          y >= sprite.y && y <= sprite.y + sprite.height) {
        this._currentDragged = sprite;
        sprite._dragging = true;
        break;
      }
    }
  }

  if (TouchInput.isPressed() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite.x = TouchInput.x - sprite.width / 2;
    sprite.y = TouchInput.y - sprite.height / 2;
  }

  if (TouchInput.isReleased() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite._dragging = false;
    this.tryDrop(sprite);
    this._currentDragged = null;
  }
};



  //VENTANA DE ENLACES 
  Scene_MiniGame.prototype.openConsultaWindow = function() {
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
      // Puedes agregar más enlaces aquí
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

  //METODOS DEL PLUGING

  //funcion mostrar mas informacion 
  Scene_MiniGame.prototype.createInfoButton = function() {
  const buttonWidth = 140;
  const buttonHeight = 40;
  const buttonX = 50; 
  const buttonY = 120;

  // Crear el botón
  const infoButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  infoButton._normalColor = '#007bff';
  infoButton._hoverColor = '#0056b3';
  infoButton._textColor = '#ffffff';
  infoButton._isHovered = false;

  const drawButton = (bgColor, textColor) => {
    infoButton.bitmap.clear();
    infoButton.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, bgColor);
    infoButton.bitmap.textColor = textColor;
    infoButton.bitmap.drawText("Información", 0, 0, buttonWidth, buttonHeight, 'center');
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
  "Puedes hacer clic en consultas",
  "o en salir, para consultar tus notas de estudio,",
  "diario de campo u otros documentos",
  "que te permitan tener más certeza en tu respuesta."
];

for (let i = 0; i < lines.length; i++) {
  tooltip.bitmap.drawText(lines[i], 10, i * 22, 430, 30, 'left');
}
  tooltip.x = infoButton.x + buttonWidth + 10;
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


  //funcion mostrar puntaje de la tarea 2
  Scene_MiniGame.prototype.createFinalScoreBox = function() {
  const finalScoreBox = new Sprite(new Bitmap(300, 40));
  finalScoreBox.x = 555;  // Cambiar la posición
  finalScoreBox.y = 40;

  finalScoreBox.bitmap.fillRect(0, 0, 225, 40, "#d5f5e3"); 
  finalScoreBox.bitmap.textColor = "#000000";
  const vida = $gameVariables.value(4);
  finalScoreBox.bitmap.drawText("Calificacion " + vida, 0, 0, 250, 40, 'left');

  this._finalScoreBox = finalScoreBox;
  this.addChild(finalScoreBox);
};

    //Mostrar el puntaje en pantalla
  Scene_MiniGame.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 390;
  scoreBox.y = 40;

 
  scoreBox.bitmap.fillRect(0, 0, 145, 40, "#ffffcc");
  scoreBox.bitmap.textColor = "#000000";
  //scoreBox.bitmap.drawText("Prueba " + _internalScore, 0, 0, 250, 40, 'left');
  scoreBox.bitmap.drawText("Prueba " + $gameSystem._internalScore, 0, 0, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};

  //Metodo de validacion 
  Scene_MiniGame.prototype.checkAllBoxesFilled = function() {
  const allFilled = this._dropBoxes.every(box => box._occupied);
  if (!allFilled) return;

  const groups = this.getBoxGroups();
  let valid = true;

  for (let g = 0; g < groups.length; g++) {
    const expectedNumbers = groups[g]; // Ej: [2,6]
    const box1 = this._dropBoxes[g * 2];
    const box2 = this._dropBoxes[g * 2 + 1];

    const entered = [box1._currentNumber, box2._currentNumber];

    // Validar si los dos números ingresados están en el conjunto correcto
    if (
      !expectedNumbers.includes(entered[0]) ||
      !expectedNumbers.includes(entered[1]) ||
      entered[0] === entered[1]
    ) {
      valid = false;
      break;
    }
  }

  
};


  //metod del boton de enlaces
  Scene_MiniGame.prototype.createConsultaButton = function() {
  const buttonX = 50;  
  const buttonY = 70;  
  const buttonWidth = 140;
  const buttonHeight = 40;

  const button = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  button._normalColor = '#337ab7';    
  button._hoverColor = '#b8dbfaff';     
  button._textColor = '#f5bfbfff';      

  button._isHovered = false;

  //  Estilo inicial
  const drawButton = (bgColor, textColor) => {
    button.bitmap.clear();

    // Fondo con esquinas redondeadas simuladas
    button.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, bgColor);
    button.bitmap.textColor = textColor;
    button.bitmap.drawText("Consultas", 0, 0, buttonWidth, buttonHeight, 'center');

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


//funcion para crear la imagen en la ventana
 Scene_MiniGame.prototype.createImageWindow = function() {
  const sprite = new Sprite();
  const bitmap = ImageManager.loadBitmap('img/img_pluging/', 'Triada');

  bitmap.addLoadListener(() => {
    // Escalar la imagen al tamaño de la pantalla
    sprite.bitmap = bitmap;
    sprite.scale.x = Graphics.width / bitmap.width;
    sprite.scale.y = Graphics.height / bitmap.height;
    sprite.x = 0;
    sprite.y = 0;
  });

  this.addChild(sprite);
 };


Scene_MiniGame.prototype.createDraggableNumbers = function() {
  this._draggableNumbers = [];

  const numberPositions = [
    { x: 475, y: 150 }, //1
    { x: 475, y: 205 }, //2
    { x: 475, y: 240 }, //3
    { x: 475, y: 270 }, //4
    { x: 475, y: 305 }, //5
    { x: 475, y: 340 }, //6
    { x: 475, y: 370 },  //7
    { x: 475, y: 410 },  //8
    { x: 475, y: 460 },  //9
    { x: 470, y: 495 }, //10
    { x: 470, y: 530 }, //11
    { x: 470, y: 585 }  //12
  ];

  for (let i = 0; i < numberPositions.length; i++) {
    const number = i + 1;
    const pos = numberPositions[i];
    const sprite = new Sprite(new Bitmap(100, 40));
    sprite.bitmap.textColor = "#8080f6ff"; 
    sprite.bitmap.drawText(number.toString(), 0, 0, 100, 40, 'center');
    sprite.visible = true;
    

    sprite.x = pos.x;
    sprite.y = pos.y;
    sprite._startX = sprite.x;
    sprite._startY = sprite.y;
    sprite._number = number;
    sprite._dragging = false;
    sprite._pressed = false;

    this._draggableNumbers.push(sprite);
    this.addChild(sprite);
  }

  this._currentDragged = null;
};

Scene_MiniGame.prototype.createDropBoxes = function() {
  this._dropBoxes = [];

  
  const boxPositions = [
    { x: 310, y: 200 }, //1
    { x: 310, y: 250 }, //2
    { x: 40, y: 370 }, //3
    { x: 40, y: 420 }, //4
    { x: 390, y: 370 }, //5
    { x: 390, y: 420 } //6
  ];

  const correctAnswers = [2, 6, 1, 8, 4, 11]; //Respuestas correctas por orden

  for (let i = 0; i < boxPositions.length; i++) {
    const pos = boxPositions[i];
    const box = new Sprite(new Bitmap(200, 50));
    box.bitmap.fontSize = 20; 
    box.bitmap.fillRect(0, 0, 70, 40, '#767878ff');
    box.bitmap.drawText("Suelta aquí", 3, 0, 60, 40, 'center');
    box.x = pos.x;
    box.y = pos.y;
    box._occupied = false;
    box._correctNumber = correctAnswers[i]; // Respuesta correcta
    box._currentNumber = null;
    
    this._dropBoxes.push(box);
    this.addChild(box);
  }
  
};
Scene_MiniGame.prototype.getBoxGroups = function() {
  return [
    [2, 6],   // cajas 0 y 1
    [1, 8],   // cajas 2 y 3
    [4, 11]   // cajas 4 y 5
  ];
};

//Funcion para los botones de salir 
Scene_MiniGame.prototype.createBottomButtons = function() {
  const buttonWidth = 180;
  const buttonHeight = 40;

  
  const self = this;

  // BOTÓN: Finalizar prueba
  const btnFinalizar = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  btnFinalizar.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, '#b85155ff');
  btnFinalizar.bitmap.textColor = '#ffffff';
  btnFinalizar.bitmap.drawText("Salir", 0, 0, buttonWidth, buttonHeight, 'center');
  btnFinalizar.x = Graphics.width / 3 - buttonWidth - 20;
  btnFinalizar.y = Graphics.height - buttonHeight - 45;

  btnFinalizar.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    if (TouchInput.isTriggered()) {
      if (x >= this.x && x <= this.x + this.width &&
          y >= this.y && y <= this.y + this.height) {
        SceneManager.pop();
      }
    }
  };

  // BOTÓN: Cerrar sin finalizar
  const btnCerrar = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  btnCerrar.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, '#89f770ff'); 
  btnCerrar.bitmap.textColor = '#ffffff';
  btnCerrar.bitmap.drawText("Guardar", 0, 0, buttonWidth, buttonHeight, 'center');
  btnCerrar.x = Graphics.width / 3 + 20;
  btnCerrar.y = Graphics.height - buttonHeight - 45;

  btnCerrar.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    if (TouchInput.isTriggered()) {
      if (x >= this.x && x <= this.x + this.width &&
          y >= this.y && y <= this.y + this.height) {
          const isValid = self.validateAnswers(); 

        if (isValid) {
          $gameSystem._finalScore += $gameSystem._internalScore;
          const currentVida = $gameVariables.value(4);
          $gameVariables.setValue(4, currentVida + $gameSystem._internalScore);
          $gameSystem.setPassedMiniGame(true);
          //Refrescar visualmente
          SceneManager._scene._finalScoreBox.bitmap.clear();
          SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
          SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
          SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + $gameSystem._finalScore, 0, 0, 300, 40, 'left');
          alert("✅ Prueba correcta. Se sumaron " + $gameSystem._internalScore + " puntos al resultado final.");
        } else {
          $gameSystem._internalScore = Math.max(0, $gameSystem._internalScore - 1);
          alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + $gameSystem._internalScore);
        }

        // (Opcional) Refrescar el texto del puntaje
        if (self._scoreBox) {

          self._scoreBox.bitmap.clear();
          self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
          self._scoreBox.bitmap.textColor = "#000000";
          self._scoreBox.bitmap.drawText("Puntaje: " + $gameSystem._internalScore, 0, 0, 250, 40, 'left');
          
        }


        SceneManager.pop();

      }
    }
  };

  this.addChild(btnFinalizar);
  this.addChild(btnCerrar);
};

//logica de validacion 
Scene_MiniGame.prototype.validateAnswers = function() {
  const groups = this.getBoxGroups();
  for (let g = 0; g < groups.length; g++) {
    const expectedNumbers = groups[g];
    const box1 = this._dropBoxes[g * 2];
    const box2 = this._dropBoxes[g * 2 + 1];

    const entered = [box1._currentNumber, box2._currentNumber];

    if (
      !expectedNumbers.includes(entered[0]) ||
      !expectedNumbers.includes(entered[1]) ||
      entered[0] === entered[1]
    ) {
      return false;
    }
  }
  return true;
};




// lugica arrastrar y soltar
//Lógica para soltar el número
Scene_MiniGame.prototype.tryDrop = function(sprite) {
  let dropped = false;
  let replacedNumber = null;
  
  for (const box of this._dropBoxes) {
    const overlapX = sprite.x + sprite.width > box.x + 10 && sprite.x < box.x + box.width - 10;
    const overlapY = sprite.y + sprite.height > box.y + 10 && sprite.y < box.y + box.height - 10;
    const inBox = overlapX && overlapY;
    
    if (inBox) {
      // Si la caja ya tiene un número, lo guardamos para devolverlo a su posición
      if (box._occupied) {
        replacedNumber = box._currentNumber;
        const oldNumberSprite = this._draggableNumbers.find(num => num._number === replacedNumber);
        if (oldNumberSprite) {
          oldNumberSprite.x = oldNumberSprite._startX;
          oldNumberSprite.y = oldNumberSprite._startY;
          oldNumberSprite.visible = true; // Asegurarse que sea visible
        }
      }
      
      // Actualizamos la caja con el nuevo número
      box.bitmap.clear();
      box.bitmap.fillRect(0, 0, 70, 40, '#918f8fff');
      box.bitmap.drawText(sprite._number.toString(), 0, 0, 70, 40, 'center');
      box._occupied = true;
      box._currentNumber = sprite._number;
      dropped = true;
      
      // Ocultamos el sprite del número arrastrado (ya que está en la caja)
      sprite.visible = false;
      
      // Guardamos referencia al sprite en la caja para poder restaurarlo después
      box._currentSprite = sprite;
      
      this.checkAllBoxesFilled();
      break;
    }
  }

  if (!dropped) {
    sprite.x = sprite._startX;
    sprite.y = sprite._startY;
    sprite.visible = true;
  }
};





})();






// Guardar variables del minijuego
//const _DataManager_makeSaveContents = DataManager.makeSaveContents;
//DataManager.makeSaveContents = function() {
//  const contents = _DataManager_makeSaveContents.call(this);
//  contents._internalScore = _internalScore;
//  contents._finalScore = _finalScore;
//  return contents;
//};
//
//// Cargar variables del minijuego
//const _DataManager_extractSaveContents = DataManager.extractSaveContents;
//DataManager.extractSaveContents = function(contents) {
//  _DataManager_extractSaveContents.call(this, contents);
//  _internalScore = contents._internalScore || 0;
//  _finalScore = contents._finalScore || 0;
//};



// Función para verificar y bloquear el minijuego
function checkMiniGameLock() {
  if (_finalScore <= 0) {
    // Mostrar imagen y mensaje
    const scene = new Scene_GameLocked();
    SceneManager.push(scene);
    
    // Bloquear permanentemente el minijuego
    $gameSystem.setPassedMiniGame(true);
    return true;
  }
  return false;
}

// Escena para mostrar cuando el juego está bloqueado
function Scene_GameLocked() {
  this.initialize.apply(this, arguments);
}

Scene_GameLocked.prototype = Object.create(Scene_Base.prototype);
Scene_GameLocked.prototype.constructor = Scene_GameLocked;

Scene_GameLocked.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_GameLocked.prototype.create = function() {
  Scene_Base.prototype.create.call(this);
  
  // Mostrar imagen de fondo
  this._bg = new Sprite(ImageManager.loadBitmap('img/img_pluging/', 'imag', false));
  this.addChild(this._bg);
  
  // Mostrar mensaje
  const msgWindow = new Window_Base(100, 100, 500, 150);
  msgWindow.drawText("Ya no tienes más intentos disponibles", 0, 30, 500, 30, 'center');
  this.addChild(msgWindow);
  
  // Botón para cerrar
  const closeButton = new Sprite(new Bitmap(150, 40));
  closeButton.bitmap.fillRect(0, 0, 150, 40, '#FF0000');
  closeButton.bitmap.drawText("Cerrar", 0, 0, 150, 40, 'center');
  closeButton.x = Graphics.width / 2 - 75;
  closeButton.y = 300;
  
  closeButton.update = function() {
    if (TouchInput.isTriggered() && 
        TouchInput.x >= this.x && TouchInput.x <= this.x + this.width &&
        TouchInput.y >= this.y && TouchInput.y <= this.y + this.height) {
      SceneManager.pop();
    }
  };
  
  this.addChild(closeButton);
};

