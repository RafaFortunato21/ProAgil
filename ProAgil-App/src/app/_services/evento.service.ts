import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';

  constructor(private Http: HttpClient) { }

  getAllEventos() : Observable<Evento[]>{
    return this.Http.get<Evento[]>(this.baseURL);
  }

  getEventoByTema(tema: string) : Observable<Evento[]>{
    return this.Http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoById(id: number) : Observable<Evento>{
    return this.Http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postEvento(evento: Evento)  {
    return this.Http.post<Evento>(this.baseURL,evento);
  }

  putEvento(evento: Evento)  {
    return this.Http.put<Evento>(`${this.baseURL}/${evento.id}`,evento);
  }

  deleteEvento(id: number)  {
    return this.Http.delete<Evento>(`${this.baseURL}/${id}`);
  }


}
