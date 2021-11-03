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
   * @param {Array}   fecha fecha a verificar.
   * @return {Array} La fecha del día siguiente
   */
  let anno, mes, dia;
  [anno, mes, dia] = fecha;
  //Caso febrero
  if (mes == 2) {
    //Caso año bisiesto
    if (bisiesto(anno)) {
      if (dia == 29) {
        return anno, 3, 1;
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
    dias_mes = mes in [4, 6, 9, 11] ? 30 : 31;
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
   */

  // Se resta 1 al año dado que enero se cuenta como mes del año anterior en el método de sakamoto
  anno -= 1;
  // Se obtiene el codigo del año incluyendo "leap years"
  const codigoanno = anno / 4 - anno / 100 + anno / 400;
  // Se obtiene el día de la semana mediante el método de Sakamoto
  const dia_semana = (anno + codigoanno + 0 + 1) % 7;
  return Math.trunc(dia_semana);
}

console.log(fecha_es_valida([2001, 11, 31]));
