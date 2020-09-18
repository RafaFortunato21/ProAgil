import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';

  tokenHeader: HttpHeaders;

  constructor(private Http: HttpClient) {
    this.tokenHeader = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('token')}`})
   }

  getAllEventos() : Observable<Evento[]>{
    
    return this.Http.get<Evento[]>(this.baseURL, {headers: this.tokenHeader});
  }

  getEventoByTema(tema: string) : Observable<Evento[]>{
    
    return this.Http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoById(id: number) : Observable<Evento>{
    return this.Http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postUpload(file: File, nomeArquivo: string){

    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, nomeArquivo); 

    return this.Http.post(`${this.baseURL}/upload`, formData, {headers: this.tokenHeader});
  }

  postEvento(evento: Evento)  {
    return this.Http.post<Evento>(this.baseURL,evento, {headers: this.tokenHeader});
  }

  putEvento(evento: Evento)  {
    return this.Http.put<Evento>(`${this.baseURL}/${evento.id}`,evento);
  }

  deleteEvento(id: number)  {
    return this.Http.delete<Evento>(`${this.baseURL}/${id}`);
  }


}
