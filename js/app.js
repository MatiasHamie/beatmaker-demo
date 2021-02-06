/**
 * Pasos segun el instructor:
 *
 * 1. traerme todos los pads y los sonidos
 */

class Drumkit {
  constructor() {
    this.selects = document.querySelectorAll("select");

    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");

    this.currentKick = "./allSounds/kick-classic.wav";
    this.currentSnare = "./allSounds/snare-acoustic01.wav";
    this.currentHihat = "./allSounds/hihat-acoustic01.wav";

    this.pads = document.querySelectorAll(".pad");
    this.index = 0;
    this.bpm = 150;

    this.playBtn = document.querySelector(".play");
    this.isPlaying = null;

    this.muteBtns = document.querySelectorAll(".mute");

    this.tempoSlider = document.querySelector('.tempo-slider');
  }

  repeat() {
    // Aca viene algo muy loco q aprendi
    // ejemplo:
    // a % n ..
    // Si n = 0, va a dar undefined (no se puede dividir por 0)
    // El resultado Siempre va a ser un entero
    // si a < n, el resultado siempre va a ser a.
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);
    activeBars.forEach((bar) => {
      // animation: name duration timing-function delay iteration-count direction fill-mode;
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;

      /**
       * Tengo q poner this.elqueseaAudio.currentTime = 0 cada vez
       * que entra al if de cada tipo de audio, ya que no se reproduce de nuevo
       * un audio muy seguido de otro porque ya esta en play!
       */
      if (bar.classList.contains("active")) {
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }
        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }

  start() {
    // minutos / cantidad de bpm
    const interval = (60 / this.bpm) * 1000;
    this.updateBtn();

    /**
     * Cuando creamos un intervalo, podemos usar el valor de retoron
     * para saber si esta funcionando o no, para poder usar (como
     * en este caso) un if que se fije si ese valor de retorno (un id) tiene algo,
     * si tiene algo, llamo a clearInterval y paso como parametro ese valor
     * de retorno y luego a ese valor de retorno lo pongo null.
     *
     * caso contrario activo el interval y listo
     *
     * Esta info esta en https://www.w3schools.com/jsref/met_win_setinterval.asp
     *
     */
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }

  updateBtn() {
    if (!this.isPlaying) {
      this.playBtn.innerText = "Stop";
      this.playBtn.classList.add("active");
    } else {
      this.playBtn.innerText = "Play";
      this.playBtn.classList.remove("active");
    }
  }

  activePad() {
    this.classList.add("active");
  }

  changeSound(e) {
    const selectionName = e.target.name;
    const selectionValue = e.target.value;

    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;

      default:
        break;
    }
  }

  mute(e) {
    console.log(e.target.getAttribute("data-track"));

    const muteIndex = +e.target.getAttribute("data-track");

    e.target.classList.toggle("active");

    if (e.target.classList.contains("active")) {
      console.log(typeof(muteIndex));
      switch (muteIndex) {
        case 0:
          this.kickAudio.volume = 0;
          break;
        case 1:
          this.snareAudio.volume = 0;
          break;
        case 2:
          this.hihatAudio.volume = 0;
          break;
        default:
          break;
      }
    } else {
      switch (muteIndex) {
        case 0:
          this.kickAudio.volume = 1;
          break;
        case 1:
          this.snareAudio.volume = 1;
          break;
        case 2:
          this.hihatAudio.volume = 1;
          break;
        default:
          break;
      }
    }
  }

  changeTempo(e){
    const tempoText = document.querySelector('.tempo-nr');
    this.bpm = e.target.value;
    tempoText.innerText = e.target.value;
  }

  updateTempo(){
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector('.play');
    if(playBtn.classList.contains('active')){
      this.start();
    }
  }
}

const drumKit = new Drumkit();

drumKit.playBtn.addEventListener("click", function () {
  drumKit.start();
});
// drumKit.playBtn.addEventListener("click", drumKit.start);

drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (event) {
    drumKit.changeSound(event);
  });
});

drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    drumKit.mute(event);
  });
});

/**
 * La dif de input con change, es q este ultimo acciona solo cuando
 * soltas el mouse
 */
drumKit.tempoSlider.addEventListener('input', function(event){
  drumKit.changeTempo(event);
})

drumKit.tempoSlider.addEventListener('change', function(event){
  drumKit.updateTempo(event);
})
