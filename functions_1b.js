// Valor de cada mes según congruencia de Zeller
const VALOR_MESES_ZELLER = [0, 13, 14, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function fecha_es_tupla(fecha) {
  /**
   * Verifica si el parámetro recibido es una tupla de tres enteros positivos.
   * @param {Array}   fecha            Valor a verificar.
   * @return {boolean} Verdadero si se recibe una tupla de tres enteros positivos, falso en caso contrario.
   */
  // Verifica que se recibe una tupla de tres elementos
  if (!Array.isArray(fecha) || fecha.length != 3) {
    return false;
  }
  // Verifica que los tres elementos sean números enteros positivos
  for (const valor of fecha) {
    if (!Number.isInteger(valor) || valor < 0) {
      return false;
    }
  }
  return true;
}

function bisiesto(anno) {
  /**
   * Verifica si un año dado es bisiesto.
   * @param {Number}   anno            Año a verificar.
   * @return {boolean} null si no recibe un año válido, true si el año válido es bisiesto y false en caso contrario.
   */
  // Verifica que el año es válido
  if (!Number.isInteger(anno) || anno < 1582) {
    return null;
  }
  // Verifica que el año sea bisiesto, y retorna false cuando falle la verificación
  if (anno % 400 == 0 || (anno % 4 == 0 && anno % 100 != 0)) {
    return true;
  }
  return false;
}

function fecha_es_valida(fecha) {
  /**
   * Verifica si una fecha dada es válida a partir de la entrada en vigencia del calendario gregoriano.
   * @param {Array}   fecha           fecha a verificar.
   * @return {boolean} None si no recibe un formato de fecha válido, true si la fecha es válida y false en caso contrario.
   */
  // Verifica que se reciba una fecha en el formato correcto
  if (!fecha_es_tupla(fecha)) {
    return null;
  }
  let anno, mes, dia;
  [anno, mes, dia] = fecha;
  // Verifica que la fecha posea un mes y años válidos
  if (anno < 1582 || ![...Array(13).keys()].includes(mes) || mes == 0) {
    return false;
  }
  // Verifica que la fecha sea posterior a la entrada en vigencia del calendario
  if (anno == 1582 && (mes < 10 || (mes == 10 && dia < 15))) {
    return false;
  }
  let limiteDia;
  // Si el mes de la fecha es febrero, determina el valor de día más alto permitido, tomando en cuenta los años bisiestos
  if (mes == 2) {
    limiteDia = bisiesto(anno) ? 29 : 28;
    // Sino, determina el valor de día más alto permitido dependiendo de si el mes es de 30 o 31 días
  } else {
    limiteDia = [4, 6, 9, 11].includes(mes) ? 30 : 31;
  }

  // Verifica que el valor de de día dado es válido
  if (![...Array(limiteDia + 1).keys()].includes(dia) || dia == 0) return false;
  return true;
}

function dia_siguiente(fecha) {
  /**
   * Obtiene la fecha correspondiente al día siguiente
   * @param {Array} La fecha fecha a verificar.
   * @return {Array} La fecha del día siguiente
   */
  let anno, mes, dia;
  [anno, mes, dia] = fecha;

  //Caso febrero
  if (mes == 2) {
    //Caso año bisiesto
    if (bisiesto(anno)) {
      if (dia == 29) {
        // Retorno erróneo
        return [anno, 3, 1];
      } else {
        dia = dia + 1;
        return [anno, mes, dia];
      }
    }
    //Caso no bisiesto
    else {
      if (dia == 28) {
        return [anno, 3, 1];
      } else {
        dia = dia + 1;
        return [anno, mes, dia];
      }
    }
  } else {
    // CAMBIO: Anteriormente se utilizaba una comprobación de array al estilo python que servía pero no daba resultados consistentes. por tanto se cambió a un
    dias_mes = [4, 6, 9, 11].includes(mes) ? 30 : 31;
    // Caso de ser el último día del mes
    if (dia == dias_mes) {
      //En caso de ser diciembre
      if (mes == 12) {
        //  Avanza un año
        return [anno + 1, 1, 1];
      } else {
        // Avanza un mes
        return [anno, mes + 1, 1];
      }
    }
    // Casi día común de un mes común
    else {
      dia = dia + 1;
      return [anno, mes, dia];
    }
  }
}

function dias_desde_primero_enero(fecha) {
  /**
   * Obtiene la cantidad de días transcurridos desde el primeor enero hasta el día actual
   * @param {Array}   fecha fecha a verificar.
   * @return {Number} cantidad de días transcurridos
   */
  let anno, mes, dia;
  [anno, mes, dia] = fecha;
  let dias_totales = 0;
  let dias_mes;
  let meses30 = [4, 6, 9, 11];
  // Se hace un ciclo por cada més hasta el més solicitado
  for (i = 1; i <= mes; i++) {
    // Si es el mes dado en la fecha solo se suman los días transcurridos de ese mes
    if (i == mes) {
      dias_totales = dias_totales + dia;
      return dias_totales - 1;
    }
    // En caso de ser febrero se deben hacer casos para los años bisiestos
    if (i == 2) {
      if (bisiesto(anno)) {
        dias_mes = 29;
      } else {
        dias_mes = 28;
      }
    }
    // Para el resto de meses se obtiene su cantidad de días
    else {
      if (meses30.includes(i)) {
        dias_mes = 30;
      } else {
        dias_mes = 31;
      }
    }
    // Se suman los días que ya se tenían con los del més actual
    dias_totales = dias_totales + dias_mes;
  }
  // Se resta en uno dado que no se cuenta el primero de enero
  return dias_totales - 1;
}

function dia_primero_enero(anno) {
  /**
   * Calcula que día será el primero de enero del año dado de manera que 0 = domingo , 1 = lunes ...
   * @param {Number} año a verificar
   * @return {Number} día de la semana del 0 al 6
   * Razón de cambio, uniformidad en funciones de cálculo de días, dado que se usaban dos algoritmos distintos
   */
  // Se define el día como primero de enero
  const dia = 1;
  anno--;
  // Se obtiene el valor del mes según zeller
  const mes_zeller = VALOR_MESES_ZELLER[1];
  // Se obtiene el año del siglo
  const anno_siglo = anno % 100;
  // Se obtiene el siglo
  const siglo = Math.floor(anno / 100);
  // prettier-ignore
  let dia_resultado = (dia +Math.floor((13 * (mes_zeller + 1)) / 5) +anno_siglo +Math.floor(anno_siglo / 4) + Math.floor(siglo/4)- 2 * siglo) %7
  // Se ajusta el valor del día al formato solicitado
  if (dia_resultado == 0) {
    return 6;
  } else {
    return dia_resultado - 1;
  }
}

function dia_semana(fecha) {
  /**
   * Función que retorna el día de la semana en  base a una fecha
   * @param {Fecha} fecha fecha a calcular el día de la semana
   * @return {number} El día de la semana siendo domingo = 0 , lunes = 1 , martes = 2 ... viernes = 6
   */
  if (!fecha_es_valida(fecha)) {
    return null;
  }
  let anno, mes, dia;
  // Se extraen las partes de la fecha
  [anno, mes, dia] = fecha;
  if (mes < 3) {
    anno = anno - 1;
  }
  // Se obtiene el valor del mes según zeller
  const mes_zeller = VALOR_MESES_ZELLER[mes];
  // Se obtiene el año del siglo
  const anno_siglo = anno % 100;
  // Se obtiene el siglo
  const siglo = Math.floor(anno / 100);
  // prettier-ignore
  let dia_resultado = (dia +Math.floor((13 * (mes_zeller + 1)) / 5) +anno_siglo +Math.floor(anno_siglo / 4) + Math.floor(siglo/4)- 2 * siglo) %7
  // Se ajusta el valor del día al formato solicitado
  if (dia_resultado == 0) {
    return 6;
  } else {
    return dia_resultado - 1;
  }
}

function fecha_futura(fecha, dias) {
  /**
   * Función que retorna la fecha n días a futuro
   * @param {Fecha} fecha fecha a calcular el día de la semana
   * @param {number} dias cantidad de dias a futuro
   * @return {fecha} La fecha futuro
   */
  // Validación de fechas
  if (!fecha_es_valida(fecha)) {
    return null;
  }
  if (!Number.isInteger(dias)) {
    return null;
  }
  // Validación de días
  if (dias == 0) {
    return fecha;
  }
  // Validación de días
  if (dias < 0) {
    return null;
  }
  // Cálculo de fechas
  for (let i = 0; i < dias; i++) {
    fecha = dia_siguiente(fecha);
  }
  return fecha;
}

function dias_entre(fecha1, fecha2) {
  /**
   *Función que retorna cantidad de días naturales entre dos fechas, excluyendo la fecha de fin
   *@param {Array} Una de las fechas límites del rango de días a calcular
   *@param {Array} Una de las fechas límites del rango de días a calcular
   *@return: {Number} cantidad de días naturales entre dos fechas, excluyendo la fecha de fin. None si alguna de las fechas
   *no es válida.
   */
  // Si ambas fechas son iguales, no hay días entre ellas
  if (!(fecha_es_valida(fecha1) && fecha_es_valida(fecha2))) return null;
  if (fecha1 == fecha2) return 0;
  let anno1, mes1, anno2, mes2;
  [anno1, mes1] = fecha1.slice(0, 2);
  [anno2, mes2] = fecha2.slice(0, 2);
  // Se inicializa el acumulador de los días de diferencia
  let dias_transcurridos = 0;
  // La función realiza cálculos distintos si las fechas pertenecen a años distintos por motivos de eficiencia,
  // ya que si la diferencia de días es mucha (más de un año), es más rápido calcular los años entre fechas
  if (anno1 == anno2) {
    // Si las fechas difieren por menos de un año, se determina si la diferencia esta en los meses o en los días
    // entre fechas
    let elem_diferenciador = mes1 == mes2 ? 2 : 1;
    // Se determina cuál fecha es la más antigua y cuál la más futura de acuerdo a la línea anterior
    let fecha_anterior, fecha_posterior;
    [fecha_anterior, fecha_posterior] = [fecha1, fecha2].sort(
      (a, b) => a[elem_diferenciador] - b[elem_diferenciador]
    );
    // Se calculan uno por uno los días que le siguen a la fecha más antigua hasta llegar a la fecha más futura.
    // Por cada día se agrega una unidad al acumulador
    while (JSON.stringify(fecha_anterior) != JSON.stringify(fecha_posterior)) {
      dias_transcurridos += 1;
      fecha_anterior = dia_siguiente(fecha_anterior);
    }
  } else {
    // Si las fechas difieren por más de un año, se calcula la fecha más antigua por medio del año de las fechas
    let fecha_anterior, fecha_posterior;
    [fecha_anterior, fecha_posterior] = [fecha1, fecha2].sort(
      (a, b) => a[0] - b[0]
    );
    // Se le añaden al acumulador los días que le faltan a la fecha más antigua para llegar al siguiente año,
    // para esto se le resta a la cantidad de días del año la cantidad de días que ya se llevan a la fecha
    dias_transcurridos +=
      (bisiesto(fecha_anterior[0]) ? 366 : 365) -
      dias_desde_primero_enero(fecha_anterior);
    // Se empieza el ciclo posterior con el año siguiente al de la fecha más antigua
    let anno_anterior = fecha_anterior[0] + 1;
    // Si aún hay años enteros de diferencia entre las fechas, se suman los días de dichos años al contador
    while (anno_anterior != fecha_posterior[0]) {
      dias_transcurridos += bisiesto(anno_anterior) ? 366 : 365;
      anno_anterior += 1;
    }
    // Finalmente, se añaden tambíen los días ya transcurrieron en el año de la fecha más futura
    dias_transcurridos += dias_desde_primero_enero(fecha_posterior);
  }
  return dias_transcurridos;
}

function imprimir_4x3(año) {
  /**
  *Función que imprime un calendario del año especificado, en tres columnas de cuatro meses cada una
  @param {Number} Año del cual se imprime el calendario, si es válido
  @return {null} N/A
  */
  // Verifica que el año es válido
  if (!Number.isInteger(año) || año < 1582) {
    console.log("El año ingresado no es válido");
    return;
  }
  // Establece la fecha de inicio de llenado del calendario lógico
  let fecha_actual = [año, 1, 1];
  // Establece el día de la semana de la fecha en que inicia el primer mes
  let offset_primer_dia = dia_primero_enero(año);
  // Se inicializa el arreglo de tres dimensiones que corresponde al calendario lógico. La primera dimensión (7)
  // representa los días en una semana, la segunda(6) las posibles semanas que puede abarcar un mes y la tercera(12)
  // los meses del año
  let calendario = new Array(12);

  for (let mes = 0; mes < 12; mes++) {
    calendario[mes] = new Array(6);
    for (let semana = 0; semana < 6; semana++) {
      calendario[mes][semana] = new Array(7).fill(0);
    }
  }
  // Rellena las celdas del calendario lógico hasta que avance de año
  while (fecha_actual[0] == año) {
    let mes, dia;
    [mes, dia] = fecha_actual.slice(1, 3);
    // Recupera la matriz del mes correspondiente
    let matriz_mes = calendario[mes - 1];
    // Determina en que semana debe ir el día de la fecha actual, para esto, se hace una división entera entre la
    // teorética fecha para ese día si el mes empezara un domingo, y los 7 días de la semana
    let semana = Math.floor((offset_primer_dia + dia - 1) / 7);
    // Similar a la línea anterior, se determina el día de la semana al que corresponde la fecha actual
    let dia_de_semana = (offset_primer_dia + dia - 1) % 7;
    // Se rellena el calendario lógico con el día del mes real
    matriz_mes[semana][dia_de_semana] = dia;
    // Se avanza al siguiente día del año
    fecha_actual = dia_siguiente(fecha_actual);
    // Cada vez que se da un cambio de mes en la fecha actual, se guarda el día de la semana de la fecha en que
    // inicia el nuevo mes
    if (mes != fecha_actual[1]) {
      // Si el mes inicia un domingo, se debe ajustar el día de la semana para que coincida con el domingo
      // siguiente
      offset_primer_dia = dia_de_semana < 6 ? dia_de_semana + 1 : 0;
    }
  }
  let titulo = "Calendario del año " + String(año);
  titulo = titulo.padStart(58, " ");
  console.log(titulo.padEnd(10, "pep"));
  console.log("-" + "-".repeat(31).repeat(3));

  // El ciclo de iteración más exterior itera sobre las cuatro filas de meses del resultado final, con tres meses
  // cada una. El valor de la fila exterior va de tres en tres debido a que cada fila cuenta con tres meses
  const filas_ext = [0, 3, 6, 9];
  for (let o = 0; o < filas_ext.length; o++) {
    let fila_exterior = filas_ext[o];
    // Para cada fila exterior se define una fila de impresión con los meses
    let encabezado_meses = "|";
    // También se define un arreglo con las líneas de impresión que corresponden a las seis posibles semanas que
    // cubre un mes
    let filas_semana = new Array(6).fill("|");
    // El siguiente ciclo de iteración itera sobre los meses de la fila exterior
    const columnas = [0, 1, 2];
    for (let i = 0; i < columnas.length; i++) {
      let columna_exterior = columnas[i];
      // Se agrega al encabezado de meses el título del mes actual, centrado
      let mes_string = MESES[columna_exterior + fila_exterior];
      const espacio_relleno = 30 - mes_string.length;
      // Ciclo para centrar el texto
      for (let u = 0; u < espacio_relleno / 2; u++) {
        mes_string = " " + mes_string + " ";
      }
      // Condición para evitar errores de formato en meses impares
      if (espacio_relleno % 2 != 0) {
        mes_string = mes_string.substring(0, mes_string.length - 1);
      }
      encabezado_meses += mes_string + "|";
      // Se recupera la matriz del mes correspondiente
      let matriz_mes = calendario[columna_exterior + fila_exterior];
      // EL siguiente ciclo de iteración itera sobre cada una de las líneas de impresión de semanas,
      // o líneas internas
      for (const fila_interna_i in [0, 1, 2, 3, 4, 5]) {
        let fila_interna = Number(fila_interna_i);
        // Se recupera la semana correspondiente de la matriz del mes
        let fila_semana_calendario = matriz_mes[fila_interna];
        // El ciclo de iteración más interno itera sobre los días de la semana
        for (let i = 0; i < fila_semana_calendario.length; i++) {
          const item = fila_semana_calendario[i];
          // En el arreglo de líneas de impresión, a la línea de impresión correspondiente se agrega el
          // número de día, con el formato correspondiente
          if (item == 0) {
            filas_semana[fila_interna] += "    ";
          } else {
            filas_semana[fila_interna] +=
              "  " + (item.toString().length > 1 ? item : " " + item);
          }
        }
        filas_semana[fila_interna] += "  |";
      }
    }
    // Para cada línea externa, primeramente se imprimen los nombre de los meses y los días de la semana
    console.log(
      encabezado_meses +
        "\n" +
        "|" +
        "   D   L   K   M   J   V   S  |   D   L   K   M   J   V   S  |   D   L   K   M   J   V   S  |"
    );
    // Posteriormente, para cada fila se imprime en orden sus líneas de impresión ya rellenas con los días
    for (let i = 0; i < filas_semana.length; i++) {
      console.log(filas_semana[i]);
    }
    console.log("-" + "-".repeat(31).repeat(3));
  }
  return;
}