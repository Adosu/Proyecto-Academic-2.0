import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { RecordatorioComponent } from './components/recordatorio/recordatorio.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { DetalleMateriaComponent } from './components/detalle-materia/detalle-materia.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CuadernoVirtualComponent } from './components/cuaderno-virtual/cuaderno-virtual.component';
import { AuthGuard } from './guards/auth.guard';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { NotesHostComponent } from './components/notes-host/notes-host.component';
import { RemindersHostComponent } from './components/reminders-host/reminders-host.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'actividades', component: ActividadesComponent, canActivate: [AuthGuard] },
  // { path: 'recordatorio', component: RecordatorioComponent, canActivate: [AuthGuard] },
  { path: 'recordatorio', component: RemindersHostComponent, canActivate: [AuthGuard] },
  { path: 'cursos', component: CursosComponent, canActivate: [AuthGuard] },
  { path: 'cuaderno-virtual/:id', component: NotesHostComponent, canActivate: [AuthGuard] },
  // { path: 'cuaderno-virtual/:id', component: CuadernoVirtualComponent, canActivate: [AuthGuard] },
  { path: 'detalle-materia/:id', component: DetalleMateriaComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
