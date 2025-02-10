const personajes = [
  { nombre: "Tanque", vida: 100, vidaOriginal: 100, daño: 35, defensa: 50 },
  { nombre: "Cazador", vida: 100, vidaOriginal: 100, daño: 50, defensa: 15 },
  { nombre: "Mago", vida: 100, vidaOriginal: 100, daño: 30, defensa: 20 },
  { nombre: "Healer", vida: 100, vidaOriginal: 100, daño: 15, defensa: 10 },
];

const enemigos = [
  { nombre: "Piromante", vida: 80, daño: 25, defensa: 30 },
  { nombre: "Duende", vida: 60, daño: 40, defensa: 10 },
  { nombre: "Mago Malvado", vida: 90, daño: 35, defensa: 20 },
  { nombre: "Escorpión", vida: 120, daño: 20, defensa: 40 },
];

let seleccion;
let personajeElegido;

do {
  seleccion = prompt(`Elige un personaje:
  1: Tanque
  2: Cazador
  3: Mago
  4: Healer`);

  seleccion = parseInt(seleccion);
} while (isNaN(seleccion) || seleccion < 1 || seleccion > 4);

personajeElegido = personajes[seleccion - 1];

alert(`Has elegido a:
  Nombre: ${personajeElegido.nombre}
  Vida: ${personajeElegido.vida}
  Daño: ${personajeElegido.daño}
  Defensa: ${personajeElegido.defensa}`);

function seleccionarEnemigo() {
  return enemigos[Math.floor(Math.random() * enemigos.length)];
}

function mostrarEstadisticas(personaje, enemigo) {
  console.log(`Jugador: ${personaje.nombre} - Vida: ${personaje.vida}`);
  console.log(`Enemigo: ${enemigo.nombre} - Vida: ${enemigo.vida}`);
}

function atacar(atacante, defensor) {
  const dañoBase = atacante.daño;
  const defensaEnemigo = defensor.defensa;
  const dañoFinal = Math.max(1, dañoBase - defensaEnemigo * 0.2);

  defensor.vida -= dañoFinal;
  console.log(`${atacante.nombre} ataca a ${defensor.nombre} y le hace ${dañoFinal} de daño`);
}

function defenderse(personaje) {
  const defensaOriginal = personaje.defensa;
  personaje.defensa *= 1.5; 
  console.log(`${personaje.nombre} se defiende, su defensa aumenta temporalmente`);

  setTimeout(() => {
    personaje.defensa = defensaOriginal; 
    console.log(`${personaje.nombre} ha dejado de defenderse`);
  }, 2000);
}

function curarse(personaje) {
  const curacion = 20;
  personaje.vida = Math.min(personaje.vidaOriginal, personaje.vida + curacion);
  console.log(`${personaje.nombre} se cura ${curacion} puntos de vida`);
}

function accionEnemigo(enemigo, personaje) {
  const accion = Math.random() < 0.5 ? "Atacar" : "Defenderse";

  if (accion === "Atacar") {
    atacar(enemigo, personaje);
  } else {
    console.log(`${enemigo.nombre} se defiende y reducirá el daño del próximo ataque`);
    
    const defensaOriginalEnemigo = enemigo.defensa;
    enemigo.defensa *= 2; 

    setTimeout(() => {
      enemigo.defensa = defensaOriginalEnemigo; 
      console.log(`${enemigo.nombre} ha dejado de defenderse`);
    }, 1000);
  }
}

function mostrarEstado(personaje, enemigo) {
  console.log(`Estado actual:
  ${personaje.nombre} - Vida: ${personaje.vida}
  ${enemigo.nombre} - Vida: ${enemigo.vida}`);
}

function cicloDeCombate(personaje, enemigo) {
  while (personaje.vida > 0 && enemigo.vida > 0) {
    let accion = prompt("¿Qué quieres hacer? \n1: Atacar \n2: Defenderse \n3: Curarse \n(Cancelar para rendirse)");

    if (accion === null) {
      console.log("Te has rendido. El combate ha terminado.");
      alert("Te has rendido. ¡Fin del combate!");
      return;
    }

    switch (accion) {
      case "1":
        atacar(personaje, enemigo);
        break;
      case "2":
        defenderse(personaje);
        break;
      case "3":
        curarse(personaje);
        break;
      default:
        console.log("Acción no válida");
        continue;
    }

    if (enemigo.vida > 0) {
      accionEnemigo(enemigo, personaje);
    }

    mostrarEstado(personaje, enemigo);
  }

  if (personaje.vida <= 0) {
    console.log("Has perdido el combate.");
    alert("¡Has perdido el combate!");
  } else if (enemigo.vida <= 0) {
    console.log("¡Has ganado el combate!");
    alert("¡Has ganado el combate!");
  }
}

function iniciarCombate() {
  let enemigo = seleccionarEnemigo();

  alert(`Tu enemigo es: ${enemigo.nombre}`);
  mostrarEstadisticas(personajeElegido, enemigo);

  cicloDeCombate(personajeElegido, enemigo);
}

iniciarCombate();
