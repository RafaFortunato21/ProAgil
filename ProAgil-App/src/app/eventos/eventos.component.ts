import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import {  ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[] ;
  evento: Evento ;
  modoSalvar = 'post';
  bodyDeletarEvento: string;
  
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  
  
  
  // tslint:disable-next-line: variable-name
  _filtroLista: string;
  nameImg: any;
  
  
  constructor(
    private eventoService: EventoService
    // tslint:disable-next-line: align
    , private modalService: BsModalService
    // tslint:disable-next-line: align
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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
      this.evento = Object.assign({},evento);
      this.fileNameToUpdate = evento.imagemURL.toString();
      this.evento.imagemURL = '';
      this.registerForm.patchValue(this.evento);
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
          this.toastr.success('Deletado com sucesso.');
        }, error => {
          this.toastr.error(`Erro ao tentar deletar ${error}.`);
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
      
      uploadImagem() {
        if (this.modoSalvar == 'post') {
          const nomeArquivo = this.evento.imagemURL.split('\\',3);
          this.nameImg = nomeArquivo[2];
        }
        else{
          this.nameImg = this.fileNameToUpdate
        }


        this.evento.imagemURL = this.nameImg;
        this.eventoService.postUpload(this.file,  this.nameImg).subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
      }
      
      salvarAlteracao(template: any){
        if(this.registerForm.valid){
          
          if(this.modoSalvar === 'post'){
            this.evento = Object.assign({}, this.registerForm.value);
            
            this.uploadImagem();
            
            
            this.eventoService.postEvento(this.evento).subscribe(
              (novoEvento: Evento) => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
                this.toastr.success('Inserido com sucesso.');
              }, error => {
                this.toastr.error(`Erro ao inserir. ${error} `);
              }
              
              );
            }else{
              this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
              
              this.uploadImagem();
              
              this.eventoService.putEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  console.log(novoEvento);
                  template.hide();
                  this.getEventos();
                  this.toastr.success('Editado com sucesso.');
                }, error => {
                  this.toastr.error(`Erro ao editar. ${error} `);
                }
                
                );
              }
              
            }
          }
          onFileChange(event){
            const reader = new FileReader();
            
            if (event.target.files && event.target.files.length) {
              this.file = event.target.files;
              console.log(this.file);
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
              this.dataAtual = new Date().getMilliseconds().toString();
              this.eventoService.getAllEventos().subscribe(
                (_eventos: Evento[]) => {
                  this.eventos = _eventos;
                  this.eventosFiltrados = this.eventos;
                  console.log(_eventos);
                }, error => {
                  this.toastr.error(`Erro ao tentar carregar eventos. ${error} `);
                });
              }
            }
            