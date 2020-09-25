import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxCurrencyModule } from 'ngx-currency';

import { EventoService } from './_services/evento.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestranteComponent } from './palestrantes/Palestrante.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { TituloComponent  } from './_shared/titulo/titulo.component';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';

import { DateTimeFormartPipePipe } from './_helps/DateTimeFormartPipe.pipe';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [					
      AppComponent,
      NavComponent,
      EventosComponent,
      PalestranteComponent,
      DashboardComponent,
      ContatosComponent,
      TituloComponent,
      DateTimeFormartPipePipe,
      UserComponent,
      LoginComponent,
      RegistrationComponent
      ,EventoEditComponent
   ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    EventoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
