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

    // Inicializa particles.js
    setTimeout(() => {
      this.initParticles();
    }, 500);
  }

  private initParticles() {
    const particlesJS = (window as any).particlesJS;
    const particlesElement = document.getElementById('particles-js');
    
    if (!particlesJS || !particlesElement) {
      return;
    }
    
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#7121ab'
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#7121ab',
          opacity: 0.35,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'remove'
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }

  submit() {
    this.onSubmit.emit();
  }

  navigate() {
    this.onNavigate.emit();
  }
}
