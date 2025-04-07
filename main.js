let personaje = {
    nombre: "Heroe",
    vida: 100,
    habilidadCooldown: false
};

let enemigo = {
    nombre: "Goblin",
    vida: 100
};

let historialCombates = JSON.parse(localStorage.getItem("historialCombates")) || { ganados: 0, perdidos: 0 };
let combateTerminado = false;

const nombrePersonaje = document.getElementById("nombre-personaje");
const vidaPersonaje = document.getElementById("vida-personaje");
const nombreEnemigo = document.getElementById("nombre-enemigo");
const vidaEnemigo = document.getElementById("vida-enemigo");
const resultadoDiv = document.getElementById("resultado");
const reiniciarBtn = document.getElementById("reiniciar-btn");
const historialDiv = document.getElementById("historial");

const cargarJuego = async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        let datosPersonaje = JSON.parse(localStorage.getItem("personaje"));
        personaje = datosPersonaje || { ...data.personaje, habilidadCooldown: false };

        // Si querés también cargar el enemigo desde el JSON
        enemigo = { ...data.enemigo };

        nombrePersonaje.textContent = personaje.nombre;
        vidaPersonaje.textContent = personaje.vida;
        nombreEnemigo.textContent = enemigo.nombre;
        vidaEnemigo.textContent = enemigo.vida;

        actualizarHistorial();
    } catch (error) {
        console.error("Error cargando data.json:", error);
        Swal.fire("Error cargando los datos del juego.");
    }
};

const actualizarVida = () => {
    vidaPersonaje.textContent = personaje.vida;
    vidaEnemigo.textContent = enemigo.vida;
};

const actualizarHistorial = () => {
    const textoHistorial = document.getElementById("texto-historial");
    textoHistorial.textContent = `Ganados: ${historialCombates.ganados} | Perdidos: ${historialCombates.perdidos}`;
};


const verificarFinCombate = () => {
    if (enemigo.vida <= 0) {
        Swal.fire(`¡Has derrotado al ${enemigo.nombre}!`);
        historialCombates.ganados++;
        guardarHistorial();
        mostrarBotonReiniciar();
        combateTerminado = true;
        return true;
    }
    if (personaje.vida <= 0) {
        Swal.fire(`¡Has sido derrotado por un ${enemigo.nombre}!`);
        historialCombates.perdidos++;
        guardarHistorial();
        mostrarBotonReiniciar();
        combateTerminado = true;
        return true;
    }
    return false;
};

const atacar = () => {
    if (combateTerminado) return;
    if (verificarFinCombate()) return;
    let dano = Math.floor(Math.random() * 20) + 1;
    enemigo.vida -= dano;
    Swal.fire(`¡Atacaste al ${enemigo.nombre} e hiciste ${dano} puntos de daño!`).then(() => {
        actualizarVida();
        if (!verificarFinCombate()) turnoEnemigo();
    });
};

const defender = () => {
    if (combateTerminado) return;
    if (verificarFinCombate()) return;
    Swal.fire("Te has defendido. Reducirás el daño del próximo ataque.").then(() => {
        turnoEnemigo(true);
    });
};

const curar = () => {
    if (combateTerminado) return;
    if (verificarFinCombate()) return;
    if (personaje.vida < 100) {
        let curacion = Math.floor(Math.random() * 20) + 1;
        personaje.vida += curacion;
        if (personaje.vida > 100) personaje.vida = 100;
        Swal.fire(`Te curaste ${curacion} puntos de vida.`).then(() => {
            actualizarVida();
            turnoEnemigo();
        });
    } else {
        Swal.fire("Tu vida ya está al máximo.");
    }
};

const habilidadEspecial = () => {
    if (combateTerminado) return;
    if (verificarFinCombate()) return;
    if (personaje.habilidadCooldown) {
        Swal.fire("La habilidad especial está en cooldown.");
    } else {
        let dano = Math.floor(Math.random() * 40) + 10;
        enemigo.vida -= dano;
        Swal.fire(`¡Usaste tu habilidad especial! Hiciste ${dano} puntos de daño al enemigo.`).then(() => {
            personaje.habilidadCooldown = true;
            setTimeout(() => { personaje.habilidadCooldown = false; }, 5000);
            actualizarVida();
            if (!verificarFinCombate()) turnoEnemigo();
        });
    }
};

const turnoEnemigo = (defendido = false) => {
    if (combateTerminado) return;
    if (verificarFinCombate()) return;
    let dano = Math.floor(Math.random() * 20) + 5;
    if (defendido) {
        dano = Math.floor(dano / 2);
    }
    personaje.vida -= dano;
    Swal.fire(`El ${enemigo.nombre} te atacó e hizo ${dano} puntos de daño.`).then(() => {
        actualizarVida();
        verificarFinCombate();
    });
};

const mostrarBotonReiniciar = () => {
    reiniciarBtn.style.display = "block";
    reiniciarBtn.addEventListener("click", reiniciarCombate);
};

const reiniciarCombate = () => {
    personaje = { nombre: "Heroe", vida: 100, habilidadCooldown: false };
    enemigo = { nombre: "Goblin", vida: 100 };
    combateTerminado = false;
    resultadoDiv.textContent = "";
    actualizarVida();
    reiniciarBtn.style.display = "none";
    localStorage.setItem("personaje", JSON.stringify(personaje));
};

const guardarHistorial = () => {
    localStorage.setItem("historialCombates", JSON.stringify(historialCombates));
    actualizarHistorial();
};

document.getElementById("resetear-historial").addEventListener("click", () => {
    Swal.fire({
        title: "¿Seguro?",
        text: "Esto reiniciará tu historial de combates.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, reiniciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            historialCombates = { ganados: 0, perdidos: 0 };
            guardarHistorial();
            Swal.fire("¡Historial reiniciado!");
        }
    });
});



cargarJuego();

document.getElementById("atacar").addEventListener("click", atacar);
document.getElementById("defender").addEventListener("click", defender);
document.getElementById("curar").addEventListener("click", curar);
document.getElementById("habilidad").addEventListener("click", habilidadEspecial);
