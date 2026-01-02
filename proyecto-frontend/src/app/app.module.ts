import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NabvarComponent } from './components/nabvar/nabvar.component';
import { HomeComponent } from './components/home/home.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { DetalleMateriaComponent } from './components/detalle-materia/detalle-materia.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecordatorioComponent } from './components/recordatorio/recordatorio.component';
import { CuadernoVirtualComponent } from './components/cuaderno-virtual/cuaderno-virtual.component';
import { ContenidoApunteComponent } from './components/contenido-apunte/contenido-apunte.component';
import { ContenidoTemaComponent } from './components/contenido-tema/contenido-tema.component';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    HomeComponent,
    CursosComponent,
    ActividadesComponent,
    DetalleMateriaComponent,
    LoginComponent,
    PerfilComponent,
    RegistroComponent,
    RecordatorioComponent,
    CuadernoVirtualComponent,
    ContenidoApunteComponent,
    ContenidoTemaComponent,
    ModalConfirmacionComponent,
    CalendarioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'es-EC' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
