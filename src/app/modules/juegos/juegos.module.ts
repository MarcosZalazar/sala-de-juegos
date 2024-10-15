import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JuegosRoutingModule } from './juegos-routing.module';
import { HeaderComponent } from '../../components/header/header.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayoromenorComponent } from './components/mayoromenor/mayoromenor.component';
import { PreguntadosComponent } from './components/preguntados/preguntados.component';
import { WordleComponent } from './components/wordle/wordle.component';
import { SaladechatComponent } from './components/saladechat/saladechat.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ResultadosComponent } from './components/resultados/resultados.component';


@NgModule({
  declarations: [
    AhorcadoComponent,
    MayoromenorComponent,
    PreguntadosComponent,
    WordleComponent,
    SaladechatComponent,
    EncuestaComponent,
    ResultadosComponent
  ],
  exports: [
    AhorcadoComponent,
    MayoromenorComponent,
    PreguntadosComponent,
    WordleComponent,
    SaladechatComponent,
    EncuestaComponent,
    ResultadosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
