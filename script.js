function V_nombre(texto) {
  document.querySelector("#Vista_nombre").innerHTML = texto;
}
function V_Puesto(texto) {
  document.querySelector("#Vista_puesto").innerHTML = texto;
}
//La siguiente funcion la definí para que cargué el texto y el icono por ser opcional-
function V_cel(texto) {
  if (texto != "") {
    document.querySelector("#Vista_cel").innerHTML = "+504 " + texto;
    var x = document.querySelector("#iconocel");
    x.style.display = "inline";
  } else {
    document.querySelector("#Vista_cel").innerHTML = texto;
    var x = document.querySelector("#iconocel");
    x.style.display = "none";
  }
}
function V_Ext(texto) {
  if (texto != "") {
    document.querySelector("#Vista_ext").innerHTML = "2236-0900 ext: " + texto;
    var x = document.querySelector("#iconotel");
    x.style.display = "inline";
  } else {
    document.querySelector("#Vista_ext").innerHTML = texto;
    var x = document.querySelector("#iconotel");
    x.style.display = "none";
  }
}
function V_dept(texto) {
  document.querySelector("#Vista_departamento").innerHTML = texto;
}
function V_mail(texto) {
  document.querySelector("#Vista_mail").innerHTML = texto;
}

// Nueva función: convierte el bloque de firma en una imagen PNG y la copia al portapapeles.
// Como todos los iconos y el logo ahora están embebidos en base64 dentro del HTML,
// no dependen de ningún hosting externo, así que html2canvas puede "fotografiarlos" sin problemas de CORS.
async function ejecutar(idElemento) {
  const elemento = document.getElementById(idElemento);
  const boton = document.getElementById("btnCopiar");
  const textoOriginal = boton ? boton.innerText : "";

  if (boton) {
    boton.innerText = "Generando...";
    boton.disabled = true;
  }

  try {
    const canvas = await html2canvas(elemento, {
      backgroundColor: "#ffffff", // evita que quede fondo transparente al pegar en Outlook/Gmail
      scale: 2                    // mejor resolución en pantallas retina/alta densidad
    });

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("No se pudo generar la imagen de la firma.");
        restaurarBoton();
        return;
      }
      try {
        if (!navigator.clipboard || !window.ClipboardItem) {
          throw new Error("API de portapapeles no soportada");
        }
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        if (boton) boton.innerText = "¡Copiado! ✔";
      } catch (err) {
        console.error("Error al copiar al portapapeles:", err);
        // Respaldo: ofrecer descarga de la imagen si no se puede copiar directo
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "firma.png";
        link.click();
        URL.revokeObjectURL(url);
        alert("Tu navegador no permite copiar la imagen automáticamente (usa Chrome o Edge en HTTPS para esa función). Se descargó la firma como imagen para que la insertes manualmente.");
      } finally {
        setTimeout(restaurarBoton, 2000);
      }
    }, "image/png");

  } catch (err) {
    console.error("Error al generar la imagen de la firma:", err);
    alert("Ocurrió un error al generar la imagen de la firma.");
    restaurarBoton();
  }

  function restaurarBoton() {
    if (boton) {
      boton.innerText = textoOriginal;
      boton.disabled = false;
    }
  }
}