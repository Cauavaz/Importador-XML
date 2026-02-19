import { Component, ChangeDetectorRef } from '@angular/core';
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
export class UploadComponent {
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
    this.uploadedFiles = []; // Limpar resultados anteriores
    
    // Forçar detecção imediata
    this.cdr.detectChanges();
    
    const filesArray = Array.from(files).filter(file => file.name.toLowerCase().endsWith('.xml'));
    
    if (filesArray.length === 0) {
      this.toastr.error('Nenhum arquivo XML válido selecionado');
      this.uploading = false;
      this.cdr.detectChanges();
      return;
    }
    
    // Processar em sequência para evitar concorrência de escrita no SQLite
    for (const file of filesArray) {
      try {
        const result = await firstValueFrom(this.nfeService.uploadXml(file));

        const isDuplicated = Boolean(result?.duplicated);
        
        // Criar nova referência para garantir detecção
        this.uploadedFiles = [...this.uploadedFiles, {
          name: file.name,
          status: isDuplicated ? 'warning' : 'success',
          message: result.message,
          numero: result.numero,
          valor: result.valorTotal
        }];
        
        // Forçar detecção após adicionar arquivo
        this.cdr.detectChanges();

        if (isDuplicated) {
          this.toastr.info(`NF-e ${result.numero} já havia sido importada`, '', { timeOut: 2000 });
        } else {
          this.toastr.success(`NF-e ${result.numero} importada!`, '', { timeOut: 2000 });
        }
      } catch (error: any) {
        // Criar nova referência para garantir detecção
        this.uploadedFiles = [...this.uploadedFiles, {
          name: file.name,
          status: 'error',
          message: error.error?.message || 'Erro ao importar arquivo'
        }];
        
        // Forçar detecção após erro
        this.cdr.detectChanges();
        
        this.toastr.error(`Erro: ${file.name}`, '', { timeOut: 2000 });
      }
    }
    
    this.uploading = false;
    
    // Forçar detecção após finalizar
    this.cdr.detectChanges();
    
    // Atualizar lista automaticamente após importação
    this.nfeRefreshService.requestNotasRefresh();
    
    // Limpar input
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
