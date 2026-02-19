import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-default-login-layout',
  imports: [],
  templateUrl: './default-login-layout.html',
  styleUrl: './default-login-layout.scss',
})
export class DefaultLoginLayout implements AfterViewInit {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  @Output("submit") onSubmit = new EventEmitter(); 
  @Output("navigate") onNavigate = new EventEmitter();
  @Input() disablePrimaryBtn: boolean = true; 

  ngAfterViewInit() {
    // Força o play do vídeo após a view carregar
    setTimeout(() => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        // Garante que está 100% sem som
        video.muted = true;
        video.volume = 0;
        video.loop = true;
        
        // Remove todas as faixas de áudio se existirem
        const videoAny = video as any;
        if (videoAny.audioTracks) {
          for (let i = 0; i < videoAny.audioTracks.length; i++) {
            videoAny.audioTracks[i].enabled = false;
          }
        }
        
        // Tenta tocar
        video.play().catch(err => {
          console.log('Autoplay bloqueado:', err);
        });
        
        // Garante que continua sem som durante a reprodução
        video.addEventListener('play', () => {
          video.muted = true;
          video.volume = 0;
        });
      });
    }, 100);
  }

  submit() {
    this.onSubmit.emit();
  }

  navigate() {
    this.onNavigate.emit();
  }
}
