
export interface Respuestaencuesta {
  fecha: Date;
  usuario: string;
  nombre: string;
  apellido: string;
  genero: string;
  edad: number;
  telefono: string;
  juegosAAgregar: {
    juego1: boolean;
    juego2: boolean;
    juego3: boolean;
    juego4: boolean;
  };
  calificacion: number;
  respuesta1: string;
  respuesta2: string;
}
