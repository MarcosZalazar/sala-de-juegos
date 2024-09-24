import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../../services/chat.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-saladechat',
  templateUrl: './saladechat.component.html',
  styleUrl: './saladechat.component.css'
})
export class SaladechatComponent implements OnInit, AfterViewChecked {

  public chat: string = "";
  @ViewChild('appMensajes') appMensajes!: ElementRef;

  constructor( public chatService: ChatService ) {}

  ngOnInit(){
    this.chatService.devolverChats().subscribe(() => {
      this.scrollToBottom();
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
