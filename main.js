let personaje = {
    nombre: "Heroe",
    vida: 100,
    habilidadCooldown: false
};

let enemigo = {
    nombre: "Goblin",
    vida: 100
};

const nombrePersonaje = document.getElementById("nombre-personaje");
const vidaPersonaje = document.getElementById("vida-personaje");
const nombreEnemigo = document.getElementById("nombre-enemigo");
const vidaEnemigo = document.getElementById("vida-enemigo");
const resultadoDiv = document.getElementById("resultado");
const reiniciarBtn = document.getElementById("reiniciar-btn");

const cargarJuego = () => {
    let datosPersonaje = JSON.parse(localStorage.getItem("personaje"));
    if (datosPersonaje) {
        personaje = datosPersonaje;
    }
    nombrePersonaje.textContent = personaje.nombre;
    vidaPersonaje.textContent = personaje.vida;
    nombreEnemigo.textContent = enemigo.nombre;
    vidaEnemigo.textContent = enemigo.vida;
};

const actualizarVida = () => {
    vidaPersonaje.textContent = personaje.vida;
    vidaEnemigo.textContent = enemigo.vida;
};

const atacar = () => {
    let dano = Math.floor(Math.random() * 20) + 1;
    enemigo.vida -= dano;
    resultadoDiv.textContent = `¡Atacaste al ${enemigo.nombre} y le hiciste ${dano} puntos de daño!`;
    if (enemigo.vida <= 0) {
        resultadoDiv.textContent = `¡Has derrotado al ${enemigo.nombre}!`;
        mostrarBotonReiniciar();
    }
    actualizarVida();
    turnoEnemigo();
};

const defender = () => {
    let defensa = Math.floor(Math.random() * 10) + 1;
    personaje.vida += defensa;
    resultadoDiv.textContent = `Te defendiste y recuperaste ${defensa} puntos de vida.`;
    actualizarVida();
    turnoEnemigo();
};

const curar = () => {
    if (personaje.vida < 100) {
        let curacion = Math.floor(Math.random() * 20) + 1;
        personaje.vida += curacion;
        if (personaje.vida > 100) personaje.vida = 100;
        resultadoDiv.textContent = `Te curaste ${curacion} puntos de vida.`;
    } else {
        resultadoDiv.textContent = "Tu vida ya está al máximo.";
    }
    actualizarVida();
    turnoEnemigo();
};

const habilidadEspecial = () => {
    if (personaje.habilidadCooldown) {
        resultadoDiv.textContent = "La habilidad especial está en cooldown.";
    } else {
        let dano = Math.floor(Math.random() * 40) + 10;
        enemigo.vida -= dano;
        resultadoDiv.textContent = `¡Usaste tu habilidad especial! Hiciste ${dano} puntos de daño al enemigo.`;
        personaje.habilidadCooldown = true;
        setTimeout(() => { personaje.habilidadCooldown = false; }, 5000);
        if (enemigo.vida <= 0) {
            resultadoDiv.textContent = `¡Has derrotado a ${enemigo.nombre}!`;
            mostrarBotonReiniciar();
        }
        actualizarVida();
        turnoEnemigo();
    }
};

const turnoEnemigo = () => {
    let dano = Math.floor(Math.random() * 15) + 1;
    personaje.vida -= dano;
    if (personaje.vida <= 0) {
        resultadoDiv.textContent = `¡Has sido derrotado por un ${enemigo.nombre}!`;
        mostrarBotonReiniciar();
    }
    actualizarVida();
};

const mostrarBotonReiniciar = () => {
    reiniciarBtn.style.display = "block";
    reiniciarBtn.addEventListener("click", reiniciarCombate);
};

const reiniciarCombate = () => {
    personaje = { nombre: "Heroe", vida: 100, habilidadCooldown: false };
    enemigo = { nombre: "Goblin", vida: 100 };
    resultadoDiv.textContent = "";
    actualizarVida();
    reiniciarBtn.style.display = "none";
    localStorage.setItem("personaje", JSON.stringify(personaje));
};

cargarJuego();

document.getElementById("atacar").addEventListener("click", atacar);
document.getElementById("defender").addEventListener("click", defender);
document.getElementById("curar").addEventListener("click", curar);
document.getElementById("habilidad").addEventListener("click", habilidadEspecial);
