import { IMessage } from '../../../../core/models/generic/message.interface';

export interface IDemanda {
  id: number;
  idUsuario: number;
  caratula: string;
  idTipoDemanda: number;
  idTipologia: number;
  idSubtipologia: number;
  domicilio: string;
  rutaImagen: string | null;
  informacionAdicional: string;
  paso: string;
  urlBpmn: string;
  idsArea: number[];
  fechaCreacion: string;
  estado: number;
}

export interface IDemandaCreada extends IMessage {
  id: number;
}

export interface IDemandaList {
  id: number;
  caratula: string;
  demandante: string;
  dni: string;
  descripcion: string;
  informacionAdicional: string;
  paso: string;
  tipoDemanda: string;
  tipologia: string;
  subtipologia: string;
  estado: number;
}
