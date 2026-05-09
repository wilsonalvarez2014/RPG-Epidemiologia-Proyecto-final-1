

const QUIZ_NAMES = {
    ClasiFVariables: 147,
    CondicionesVidaDeterminantes: 164,
    DefinicionDeCaso: 153,
    DensidadOTasaDeIncidencia: 186,
    DeterminantesSocialesDeLaSalud: 155,
    IncidenciaAcumulada: 184,
    LetalidadGeneralEspecifica: 174,
    MedidasDeFrecuencia: 145,
    MedidasDispersion: 159,
    MedidasTendencia: 157,
    MinijuegoBase: 0,
    MorbilidadGeneralEspecifica: 170,
    MortalidadGeneralEspecifica: 172,
    NivelesDePrevencionSalud: 166,
    OrFactorDeExposicionPlaguicidas: 179,
    OrTomarAguaDelRioPorvenir: 178,
    OrVivirCercaMinaPorvenir: 180,
    PoblacionMuestra: 162,
    Prevalencia: 182,
    TiposVigilanciaEpidemiologica: 149,
    TriadaEcologicaDengue: 5,
    TriadaEcologicaLaptospirosis: 151
};

function getQuizIntentosRestantes(quizName){
    switch(quizName){
        case QUIZ_NAMES.ClasiFVariables:
        case QUIZ_NAMES.CondicionesVidaDeterminantes: 
        case QUIZ_NAMES.DefinicionDeCaso: 
        case QUIZ_NAMES.DensidadOTasaDeIncidencia: 
        case QUIZ_NAMES.DeterminantesSocialesDeLaSalud: 
        case QUIZ_NAMES.IncidenciaAcumulada: 
        case QUIZ_NAMES.LetalidadGeneralEspecifica: 
        case QUIZ_NAMES.MedidasDeFrecuencia:
        case QUIZ_NAMES.MedidasDispersion:
        case QUIZ_NAMES.MedidasTendencia: 
        case QUIZ_NAMES.MinijuegoBase: 
        case QUIZ_NAMES.MorbilidadGeneralEspecifica: 
        case QUIZ_NAMES.MortalidadGeneralEspecifica: 
        case QUIZ_NAMES.NivelesDePrevencionSalud: 
        case QUIZ_NAMES.OrFactorDeExposicionPlaguicidas: 
        case QUIZ_NAMES.OrTomarAguaDelRioPorvenir: 
        case QUIZ_NAMES.OrVivirCercaMinaPorvenir: 
        case QUIZ_NAMES.PoblacionMuestra: 
        case QUIZ_NAMES.Prevalencia: 
        case QUIZ_NAMES.TiposVigilanciaEpidemiologica: 
        case QUIZ_NAMES.TriadaEcologicaDengue: 
        case QUIZ_NAMES.TriadaEcologicaLaptospirosis: 
            return $gameVariables.value(quizName);
        default: return -1;
    }
};

function getQuizReprobado(quizName){
     return getQuizIntentosRestantes(quizName) === 0;
};

function getQuizAprobado(quizName){
    switch(quizName){
        case QUIZ_NAMES.ClasiFVariables: return $gameSystem.juegoCompletado2();
        case QUIZ_NAMES.CondicionesVidaDeterminantes: return $gameSystem.juegoCompletadoo121213();
        case QUIZ_NAMES.DefinicionDeCaso: return $gameSystem.juegoCompletadoo();
        case QUIZ_NAMES.DensidadOTasaDeIncidencia: return $gameSystem.juegoCompletadodencidad();
        case QUIZ_NAMES.DeterminantesSocialesDeLaSalud: return $gameSystem.juegoCompletado6();
        case QUIZ_NAMES.IncidenciaAcumulada: return $gameSystem.juegoCompletadoincidencia();
        case QUIZ_NAMES.LetalidadGeneralEspecifica: return $gameSystem.juegoCompletadoLetalidad();
        case QUIZ_NAMES.MedidasDeFrecuencia: return $gameSystem.juegoCompletado();
        case QUIZ_NAMES.MedidasDispersion: return $gameSystem.juegoCompletadoo12();
        case QUIZ_NAMES.MedidasTendencia: return $gameSystem.juegoCompletado222();
        case QUIZ_NAMES.MinijuegoBase: throw new Error("Mini Juego Base");
        case QUIZ_NAMES.MorbilidadGeneralEspecifica: return $gameSystem.juegoCompletado2222(); 
        case QUIZ_NAMES.MortalidadGeneralEspecifica: return $gameSystem.juegoCompletadoMortalidad();
        case QUIZ_NAMES.NivelesDePrevencionSalud: return $gameSystem.hasPassedMiniGameee23();
        case QUIZ_NAMES.OrFactorDeExposicionPlaguicidas: return $gameSystem.juegoCompletadoorplaguicidas();
        case QUIZ_NAMES.OrTomarAguaDelRioPorvenir: return $gameSystem.juegoCompletadooraguadelrio();
        case QUIZ_NAMES.OrVivirCercaMinaPorvenir: return $gameSystem.juegoCompletadoorcercaminaporvenir();
        case QUIZ_NAMES.PoblacionMuestra:  return $gameSystem.juegoCompletadoo1212();
        case QUIZ_NAMES.Prevalencia:  return $gameSystem.juegoCompletadoprevalencia();
        case QUIZ_NAMES.TiposVigilanciaEpidemiologica:  return $gameSystem.hapasadoEljuego();
        case QUIZ_NAMES.TriadaEcologicaDengue:  return $gameSystem.hasPassedMiniGame();
        case QUIZ_NAMES.TriadaEcologicaLaptospirosis: return $gameSystem.hasPassedMiniGameee();
        default: return false;
    }
};