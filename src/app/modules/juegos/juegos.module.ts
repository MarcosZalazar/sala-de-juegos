import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayoromenorComponent } from './components/mayoromenor/mayoromenor.component';
import { PreguntadosComponent } from './components/preguntados/preguntados.component';
import { WordleComponent } from './components/wordle/wordle.component';
import { SaladechatComponent } from './components/saladechat/saladechat.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from '../../components/header/header.component';
import { MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    AhorcadoComponent,
    MayoromenorComponent,
    PreguntadosComponent,
    WordleComponent,
    SaladechatComponent
  ],
  exports: [
    AhorcadoComponent,
    MayoromenorComponent,
    PreguntadosComponent,
    WordleComponent,
    SaladechatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    HeaderComponent,
    MatCardModule,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatIconModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
