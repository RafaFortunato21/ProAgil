import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import {  ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
  eventosFiltrados: Evento[];
  eventos: Evento[] ;
  evento: Evento ;
  modoSalvar = 'post';
  bodyDeletarEvento: string;
  
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  
  
  
  
  // tslint:disable-next-line: variable-name
  _filtroLista: string;
  
  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }
    
    get filtroLista(): string{
      return this._filtroLista;
    }
    
    set filtroLista(value: string)
    {
      this._filtroLista = value;
      this.eventosFiltrados = this.filtroLista ? this.filtrarEvento(this.filtroLista)  : this.eventos;
    }
    
    editarEvento(evento: Evento, template: any){
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = evento;
      this.registerForm.patchValue(evento);
    }
    
    
    excluirEvento(evento: Evento, template: any) {
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
    }
    
    confirmeDelete(template: any) {
      this.eventoService.deleteEvento(this.evento.id).subscribe(
        () => {
          template.hide();
          this.getEventos();
        }, error => {
          console.log(error);
        }
        );
      }
      
      novoEvento(template: any){
        this.modoSalvar = 'post';
        this.openModal(template);
      }
      
      // tslint:disable-next-line: typedef
      openModal(template: any){
        this.registerForm.reset();
        template.show();
      }
      
      
      // tslint:disable-next-line: typedef
      ngOnInit() {
        this.validation();
        this.getEventos();
      }
      
      // tslint:disable-next-line: typedef
      alternarImage(){
        this.mostrarImagem = !this.mostrarImagem;
      }
      
      validation(){
        this.registerForm = this.fb.group({
          tema:       ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
          local:      ['', Validators.required],
          dataEvento: ['', Validators.required],
          qtdPessoas: ['', [Validators.required, Validators.max(500)]],
          imagemURL:  ['', Validators.required],
          telefone:   ['', Validators.required],
          email:      ['', [Validators.required, Validators.email]]
        });
      }
      
      salvarAlteracao(template: any){
        if(this.registerForm.valid){
          
          if(this.modoSalvar === 'post'){
            this.evento = Object.assign({}, this.registerForm.value);
            this.eventoService.postEvento(this.evento).subscribe(
              (novoEvento: Evento) => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
              }, error => {
                console.log(error);
              }
              
              );
            }else{
              this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
              this.eventoService.putEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  console.log(novoEvento);
                  template.hide();
                  this.getEventos();
                }, error => {
                  console.log(error);
                }
                
                );
              }
              
            }
          }
          
          
          // tslint:disable-next-line: typedef
          filtrarEvento(filtrarPor: string): Evento[] {
            filtrarPor = filtrarPor.toLocaleLowerCase();
            return this.eventos.filter(
              evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
              );
            }
            
            // tslint:disable-next-line: typedef
            getEventos() {
              this.eventoService.getAllEventos().subscribe(
                (_eventos: Evento[]) => {
                  this.eventos = _eventos;
                  this.eventosFiltrados = this.eventos;
                  console.log(_eventos);
                }, error => {
                  console.log(error);
                });
              }
            }
            