import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResultadosService } from '../../../../services/resultados.service';
import { Resultados } from '../../../../interfaces/resultados.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent implements OnInit, OnDestroy {

  public resultados: Resultados[] = [];
  public resultadosFiltrados: Resultados[] = [];
  private resultadosSubscription!: Subscription;
  public filtro: string = '';

  constructor(public resultadosService: ResultadosService) {}

  ngOnInit(): void {
    this.resultadosSubscription = this.resultadosService.devolverResultados()
                                                        .subscribe((respuesta: Resultados[]) => {
        this.resultados = respuesta;
        this.resultadosFiltrados = respuesta;
    });
  }

  filtrarResultados(): void {
    this.resultadosFiltrados = this.resultados.filter((resultado: Resultados) =>
      resultado.usuario.toLowerCase().includes(this.filtro.toLowerCase()) ||
      resultado.juego.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    if (this.resultadosSubscription) {
      this.resultadosSubscription.unsubscribe();
    }
  }
}
