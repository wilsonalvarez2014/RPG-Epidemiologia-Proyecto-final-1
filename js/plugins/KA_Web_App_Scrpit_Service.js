/*:
 * @plugindesc Guardado en Google Sheets mediante API externa (Apps Script) - v1.0
 * @author KA EduSoft
 *
 * @help Este plugin reemplaza el guardado local por comunicación con Google Sheets.
 */

const URL_API = "https://script.google.com/macros/s/AKfycbwXUtk9xzS14dMJlapoY2rIS6Vgb6oDVfc496TseNvW59Q-ItEYVj_oPP9VW8PZW_NT_A/exec";//"https://script.google.com/macros/s/AKfycbxaDJptS1X-s_mqzUFiTaVjU7BnjNV_MVSy95LzLnWh3HMLTJkxz_vTZpzl9QOXQ-Jm1A/exec";

/**
 * Lista de nombres de los Quizes.
 * Debe coincidir con el nombre en el cliente (RPG Maker), y también
 * con los nombres en la hoja Quizes de la base de datos.
 */
const QuizNames = {
    CLASI_F_VARIABLES: "ClasiFVariables",
    MINI_JUEGO_BASE: "MiniJuego"
};

/**
 * Los posibles estados de un quiz.
 */
const QuizEstados = {
    QUIZ_ACTIVO: "Activo",
    QUIZ_REPROBADO: "Reprobado",
    QUIZ_APROBADO: "Aprobado",
    QUIZ_PENDIENTE: "Pendiente"
};

/**
 * Acciones del servidor.
 */
const ServerActions = {
      ACT_LOGIN: "Login",
      ACT_SAVE: "Save",
      ACT_REGISTRO: "Registro",
      ACT_VALIDAR_QUIZ: "Quiz"
};

(function() {
    




  /* Solicita login al iniciar. Se sustituye la escena de boot
   * para que el usuario tenga que logearse obligatoriamente.
   */
  Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Login);
  };

 
 /**
  * Creamos la escena de loguin.
  * @returns {Web_App_Scrpit_ServiceL#8.Scene_Login}
  */
 function Scene_Login() {
  this.initialize.apply(this, arguments);
}

Scene_Login.prototype = Object.create(Scene_Base.prototype);
Scene_Login.prototype.constructor = Scene_Login;

Scene_Login.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_Login.prototype.create = function() {
  Scene_Base.prototype.create.call(this);
  this.createBackground();
  this.createInputs();
  
  /**
   * Crear objeto de datos del proyecto
   * @returns {undefined}
   */
  if(!$gameSystem._ludif){
      $gameSystem._ludif = {
          documento: ""
      };
  }
};

Scene_Login.prototype.createBackground = function() {
  this._backgroundSprite = new Sprite();
  this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
  this.addChild(this._backgroundSprite);
};

// Desactiva el procesamiento de teclas por parte del juego mientras escribes en un input
Input._shouldPreventDefault = function(keyCode) {
  const active = document.activeElement;
  if (active && (active.id === "login-username" || active.tagName === "login-password")) {
        return true; // no dejar que RPG Maker MV lo procese
  }

  // comportamiento por defecto de RPG Maker
  switch (keyCode) {
    case 8:   // backspace
    case 33:  // pageup
    case 34:  // pagedown
    case 37:  // left arrow
    case 38:  // up arrow
    case 39:  // right arrow
    case 40:  // down arrow
      return true;
  }
  return false;
};

Scene_Login.prototype.createInputs = function() {
    // ===== 1) Overlay a pantalla completa =====
    const overlay = document.createElement("div");
    overlay.id = "login-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)"; // leve oscurecimiento
    overlay.style.zIndex = 9999;
    overlay.style.pointerEvents = "auto";

    // ===== 2) Contenedor del formulario =====
    const div = document.createElement("div");
    div.id = "login-container";
    div.style.backgroundColor = "rgba(0,0,0,0.8)";
    div.style.padding = "20px";
    div.style.borderRadius = "10px";
    div.style.color = "white";
    div.style.minWidth = "240px";
    div.style.textAlign = "center";
    div.style.display = "flex";
    div.style.flexDirection = "column";   // ✅ tabs arriba y contenido abajo
    div.style.gap = "12px";               // separación vertical
    div.style.justifyContent = "flex-start";
    div.style.alignItems = "stretch";     // para que la barra ocupe el ancho
    // div.style.height = "100vh";         // ❌ quítalo (o te queda enorme el panel)

    // Fuente suficientemente grande para móvil (evita zoom raro en algunos navegadores)
    div.style.fontFamily = "sans-serif";
    div.style.fontSize = "16px";

    div.innerHTML = `
        <div class="tab">
            <button id="loginTab" class="tablinks">Login</button>
            <button id="registroTab" class="tablinks">Registro</button>
        </div>
        <div id="Registro" class="auth-box tabcontent">
            <div style="margin-bottom:10px; font-weight:bold;">Registrarse</div>
            <label for="register-userdocument">Documento:</label><br>
            <input type="text" id="register-userdocument" style="width: 200px; padding:4px; margin-top:4px;"><br><br>
            <label for="register-password">Contraseña:</label><br>
            <input type="password" id="register-password" style="width: 200px; padding:4px; margin-top:4px;"><br><br>
            <label for="register-repassword">Repetir contraseña:</label><br>
            <input type="password" id="register-repassword" style="width: 200px; padding:4px; margin-top:4px;"><br><br>
            <button id="register-button" style="padding:6px 12px; font-weight:bold;">Registrarse</button>
        </div>
        <div id="Login" class="auth-box tabcontent">
            <div style="margin-bottom:10px; font-weight:bold;">Iniciar sesión</div>
            <label for="login-username">Documento:</label><br>
            <input type="text" id="login-username" style="width: 200px; padding:4px; margin-top:4px;"><br><br>
            <label for="login-password">Contraseña:</label><br>
            <input type="password" id="login-password" style="width: 200px; padding:4px; margin-top:4px;"><br><br>
            <button id="login-button" style="padding:6px 12px; font-weight:bold;">Iniciar sesión</button>
        </div>
    `;
    
    const style = document.createElement("style");
    style.innerHTML = `
        .auth-box {
            border: 1px solid white;
            padding: 20px;
            border-radius: 8px;
            min-width: 260px;
            background-color: rgba(0,0,0,0.6);
        }

        .auth-box input {
            width: 200px;
            padding: 4px;
            margin-top: 4px;
            font-size: 16px;
        }

        .auth-box button {
            padding: 6px 12px;
            font-weight: bold;
            cursor: pointer;
        }
    
        .tab {
            display: flex;           /* ✅ */
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            border-radius: 8px;
        }
    
        .tab button {
            flex: 1;                 /* ✅ mitad y mitad */
            background-color: inherit;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
        }

        .tab button:hover {
            background-color: #ddd;
        }

        .tab button.active {
            background-color: #ccc;
        }

        .tabcontent {
            display: none;
            padding: 6px 12px;
            border: 1px solid #ccc;
            border-top: none;
        }
    `;
    
    document.head.appendChild(style);
    overlay.appendChild(div);
    document.body.appendChild(overlay);
    
    //Funcíon para abrir pestañas del panel principal
    function openOption(evt, optionName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(optionName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    
    document.getElementById("loginTab").addEventListener("click", (event)=>{
        openOption(event,"Login");
    });
    
    document.getElementById("registroTab").addEventListener("click", (event) => {
        openOption(event,"Registro");
    });
    

    // ===== 3) Desactivar eventos del canvas de RPG Maker mientras el login está visible =====
    const canvas = document.querySelector("canvas");
    if (canvas) {
        // Guardamos el estado anterior para restaurarlo luego
        this._oldCanvasPointerEvents = canvas.style.pointerEvents;
        canvas.style.pointerEvents = "none";
    }

    // ===== 4) Evitar que los toques se propaguen al juego =====
    const stop = (e) => {
        e.stopPropagation();
    };
    div.addEventListener("mousedown", stop);
    div.addEventListener("touchstart", stop);
    div.addEventListener("pointerdown", stop);

    // ===== 5) Eventos del botón y tecla Enter =====
    document.getElementById("login-button").addEventListener("click", () => {
        this.onLoginOk();
    });
    
    document.getElementById("register-button").addEventListener("click", ()=>{
        this.onRegisterOk();
    });

    document.addEventListener("keydown", this._onEnterKey = (event) => {
        if (event.key === "Enter") this.onLoginOk();
    });

    // ===== 6) Enfocar automáticamente el primer campo (útil en móvil) =====
    const userInput = document.getElementById("login-username");
    if (userInput) userInput.focus();


    document.addEventListener('keydown', function(e) {
      const active = document.activeElement;
      const isInput = active && (
        active.tagName === 'INPUT' || active.tagName === 'TEXTAREA'
      );

      if (isInput) {
        // Prevenir que RPG Maker intercepte estas teclas
        e.stopImmediatePropagation();
      }
    }, true);
    
    document.getElementById("loginTab").click();

};

    Scene_Login.prototype.removeInputs = function() {
        // Quitar overlay
        const overlay = document.getElementById("login-overlay");
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        // Quitar listener de Enter
        if (this._onEnterKey) {
            document.removeEventListener("keydown", this._onEnterKey);
            this._onEnterKey = null;
        }

        // Restaurar eventos del canvas
        const canvas = document.querySelector("canvas");
        if (canvas && this._oldCanvasPointerEvents !== undefined) {
            canvas.style.pointerEvents = this._oldCanvasPointerEvents;
            this._oldCanvasPointerEvents = undefined;
        }
    };

    Scene_Login.prototype.onRegisterOk = function(){
        const userdocument = document.getElementById("register-userdocument").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const repassword = document.getElementById("register-repassword").value.trim();
        

        if (!userdocument || !password || !repassword) {
            alert("Debes completar todos los campos.");
            return;
        }else if(!esPasswordSegura(password)){
            alert("La contraseña debe tener 8 caracteres como mínimo y, al menos, una mayúscula, una minúscula y un número.");
            return;
        }else if(password!==repassword){
            alert("Las contraseñas no coinciden.");
            return;
        }
        
        fetch(URL_API, {
            redirect: "follow",
            method: "POST",
            body: JSON.stringify({ tipo: ServerActions.ACT_REGISTRO, documentoUsuario: userdocument, contrasennaUsuario: password }),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
            //No hubo error
            if(!data.error){
                //Si hay partida guardada la cargamos.
                if(data.gameSave){
                    const saveData = JsonEx.parse(decodeURIComponent(data.gameSave));
                    DataManager.loadGameDataFromObject(saveData);
                }
                
                this.removeInputs();
                $gameSystem._ludif.documento = userdocument;
                //Autoguardados
                $gameSystem._ludif._autoSaveID = setInterval(() => DataManager.saveGame(1), 120000);
                
                SceneManager.goto(Scene_Map);
            } else {
                alert(data.mensaje);
            }
        })
        .catch(e => {
            alert("ERROR");
            console.log(e);
        });
    };

    Scene_Login.prototype.onLoginOk = function() {
        const userdocument = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!userdocument || !password) {
            alert("Debes completar ambos campos.");
            return;
        }else if(!esPasswordSegura(password)){
            alert("La contraseña debe tener 8 caracteres como mínimo y, al menos, una mayúscula, una minúscula y un número.");
            return;
        }
        
        fetch(URL_API, {
            redirect: "follow",
            method: "POST",
            body: JSON.stringify({ tipo: ServerActions.ACT_LOGIN, documentoUsuario: userdocument, contrasennaUsuario: password }),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
            //No hubo error
            if(!data.error){
                //Si hay partida guardada la cargamos.
                if(data.gameSave){
                    const saveData = JsonEx.parse(decodeURIComponent(data.gameSave));
                    DataManager.loadGameDataFromObject(saveData);
                }
                
                this.removeInputs();
                $gameSystem._ludif.documento = userdocument;
                //Autoguardados
                $gameSystem._ludif._autoSaveID = setInterval(() => DataManager.saveGame(1), 120000);
                
                SceneManager.goto(Scene_Map);
            } else {
                alert(data.mensaje);
            }
        })
        .catch(e => {
            alert("ERROR");
            console.log(e);
        });
        
        
    };

    Scene_Login.prototype.cleanupInputs = function() {
        const div = document.getElementById("login-container");
        if (div) div.remove();
        document.removeEventListener("keydown", this._onEnterKey);
    };

    Scene_Login.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.cleanupInputs();
    };

 
    // En Scene_Title
   Scene_Title.prototype.commandContinue = function() {
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        fetch(URL_API, {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({ type: ServerActions.ACT_LOAD_GAME, username, password }),
          headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.save) {
            const saveData = JsonEx.parse(decodeURIComponent(data.save));
            DataManager.loadGameDataFromObject(saveData);
            SceneManager.goto(Scene_Map);
          } else {
            alert("No se pudo cargar la partida.");
          }
        })
        .catch(e => {
          alert("Error al cargar la partida.");
          console.error(e);
        });
   };

    // Deshabilitar "Continuar" si no hay login
    Scene_Title.prototype.createCommandWindow = function() {
      this._commandWindow = new Window_TitleCommand();
      this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
      this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
      this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
      this.addWindow(this._commandWindow);

      // Solo mostrar continuar si hay login en memoria
      if (!$gameSystem._username || !$gameSystem._password) {
        this._commandWindow._list = this._commandWindow._list.filter(cmd => cmd.symbol !== 'continue');
      }
    };


    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);

        // Deshabilita "Continuar" por defecto
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow._list.forEach(cmd => {
          if (cmd.symbol === 'continue') cmd.enabled = false;
          if (cmd.symbol === 'newGame') cmd.enabled = false;
        });

        // Consultar si hay partida guardada
        this.checkRemoteSave();
    };

    Scene_Title.prototype.checkRemoteSave = function() {
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        if (!username || !password) return;

        fetch(URL_API, {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({ type: ServerActions.ACT_CHECK_SAVE, username, password }),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success && data.hasSave) {
                this.enableContinueOption();
            }
        })
        .catch(e => {
          console.error("Error consultando partida remota:", e);
        });
    };

    Scene_Title.prototype.enableContinueOption = function() {
        const commandWindow = this._commandWindow;

        // Reemplaza la lista completa para asegurar la actualización visual
        commandWindow._list = [];
        if (DataManager.isAnySavefileExists()) {
          commandWindow.addCommand(TextManager.continue_, 'continue', true);
        } else {
          commandWindow.addCommand(TextManager.continue_, 'continue', true); // Forzamos que esté habilitado
        }
        commandWindow.addCommand(TextManager.newGame, 'newGame', false); // Deshabilitamos Nueva partida
        commandWindow.addCommand(TextManager.options, 'options', true);

        commandWindow.select(0);
        commandWindow.refresh();
    };

    Scene_Title.prototype.start = function() {
        location.reload(); // fuerza recarga total y volverá a Scene_Login
    };


  // Override al guardado
    DataManager.saveGame = function(savefileId) {
        const save = encodeURIComponent(JsonEx.stringify(this.makeSaveContents()));
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        return fetch(URL_API, {
              redirect: "follow",
              method: "POST",
              body: JSON.stringify({tipo: ServerActions.ACT_SAVE, documentoUsuario: $gameSystem._ludif.documento, gameSave: save}),
              headers: {
                  "Content-Type": "text/plain;charset=utf-8"
              }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                console.log("Guardado exitoso");
                return true;
            } else {
                console.error("Error en la respuesta del servidor.");
                return false;
            }
        });
    };


    DataManager.loadGameDataFromObject = function(obj) {
        try {
          this.createGameObjects();
          this.extractSaveContents(obj);
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
    };
  
    
    
/*****************************  Funciones auxiliares  ************************************/
/*****************************************************************************************/
    
    /**
     * 
     * @param {type} password
     * @returns {Boolean}
     */
    function esPasswordSegura(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }
    
    
    
    
})();

function doQuiz(nombreQuiz,estadoQuiz){
        return fetch(URL_API, {
              redirect: "follow",
              method: "POST",
              body: JSON.stringify({tipo: ServerActions.ACT_VALIDAR_QUIZ, documentoEstudiante: $gameSystem._ludif.documento, nombreQuiz: nombreQuiz,estado: estadoQuiz}),
              headers: {
                  "Content-Type": "text/plain;charset=utf-8"
              }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                console.log("Testeo",data);
                return true;
            } else {
                console.error("Error en la respuesta del servidor.");
                return false;
            }
        });
    }
