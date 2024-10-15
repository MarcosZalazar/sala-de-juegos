import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayoromenorComponent } from './components/mayoromenor/mayoromenor.component';
import { PreguntadosComponent } from './components/preguntados/preguntados.component';
import { WordleComponent } from './components/wordle/wordle.component';
import { SaladechatComponent } from './components/saladechat/saladechat.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';


const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayoromenor', component: MayoromenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'wordle', component: WordleComponent },
  { path: 'saladechat', component: SaladechatComponent },
  { path: 'resultados', component: ResultadosComponent },
  { path: 'encuesta', component: EncuestaComponent },
  { path: '', redirectTo:'ahorcado', pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
