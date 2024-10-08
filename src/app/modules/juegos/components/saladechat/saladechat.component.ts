import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../../services/chat.service';

import Swal from 'sweetalert2'
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-saladechat',
  templateUrl: './saladechat.component.html',
  styleUrl: './saladechat.component.css'
})
export class SaladechatComponent implements OnInit, AfterViewChecked {

  public chat: string = "";
  public usuarioActual: User | null = null;
  @ViewChild('appMensajes') appMensajes!: ElementRef;

  constructor( public chatService: ChatService ) {}

  ngOnInit(){
    this.chatService.devolverChats().subscribe(() => {
      this.scrollToBottom();
    });
    this.chatService.obtenerUsuarioActual().subscribe((usuario) => {
      this.usuarioActual = usuario;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.appMensajes && this.appMensajes.nativeElement) {
      this.appMensajes.nativeElement.scrollTop = this.appMensajes.nativeElement.scrollHeight;
    }
  }

  public enviarChat() : void{

    if( this.chat.length === 0 ){
      return;
    }

    this.chatService.agregarChat(this.chat)
    .then(
      ()=>this.chat = ""
    )
    .catch( (error) => {
      Swal.fire('Error', `No se pudo enviar su mensaje. Error: ${error.code}`, 'error');
    });
  }
}
