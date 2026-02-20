import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { NfeService } from '../../services/nfe.service';
import { NfeRefreshService } from '../../services/nfe-refresh.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrls: ['./upload.scss']
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploading = false;
  uploadedFiles: any[] = [];
  
  constructor(
    private router: Router,
    private nfeService: NfeService,
    private nfeRefreshService: NfeRefreshService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initParticles();
    }, 500);
  }

  private initParticles() {
    const particlesJS = (window as any).particlesJS;
    const particlesElement = document.getElementById('particles-header');
    
    if (!particlesJS || !particlesElement) {
      return;
    }
    
    particlesJS('particles-header', {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
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
          color: '#ffffff',
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
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }
  
  selectFiles() {
    this.fileInput.nativeElement.click();
    this.cdr.detectChanges();
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
    this.cdr.detectChanges();
  }
  
  private async handleFiles(files: FileList) {
    this.uploading = true;
    this.uploadedFiles = [];
    this.cdr.detectChanges();
    
    const filesArray = Array.from(files).filter(file => file.name.toLowerCase().endsWith('.xml'));
    
    if (filesArray.length === 0) {
      this.toastr.error('Nenhum arquivo XML válido selecionado');
      this.uploading = false;
      this.cdr.detectChanges();
      return;
    }
    
    for (const file of filesArray) {
      try {
        const result = await firstValueFrom(this.nfeService.uploadXml(file));

        const isDuplicated = Boolean(result?.duplicated);
        
        this.uploadedFiles = [...this.uploadedFiles, {
          name: file.name,
          status: isDuplicated ? 'warning' : 'success',
          message: result.message,
          numero: result.numero,
          valor: result.valorTotal
        }];
        
        this.cdr.detectChanges();

        if (isDuplicated) {
          this.toastr.info(`NF-e ${result.numero} já havia sido importada`, '', { timeOut: 2000 });
        } else {
          this.toastr.success(`NF-e ${result.numero} importada!`, '', { timeOut: 2000 });
        }
      } catch (error: any) {
        this.uploadedFiles = [...this.uploadedFiles, {
          name: file.name,
          status: 'error',
          message: error.error?.message || 'Erro ao importar arquivo'
        }];
        
        this.cdr.detectChanges();
        
        this.toastr.error(`Erro: ${file.name}`, '', { timeOut: 2000 });
      }
    }
    
    this.uploading = false;
    this.cdr.detectChanges();
    this.nfeRefreshService.requestNotasRefresh();
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
  clearResults() {
    this.uploadedFiles = [];
    this.cdr.detectChanges();
  }
  
  navigateToNotas() {
    this.router.navigate(['/dashboard/notas-entrada']);
    this.cdr.detectChanges();
  }
}
