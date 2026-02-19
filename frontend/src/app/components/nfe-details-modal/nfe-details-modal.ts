import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfeService } from '../../services/nfe.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

interface NfeDetailItem {
  id: number;
  codigo: string;
  descricao: string;
  ncm: string | null;
  cfop: string | null;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface NfeDetail {
  id: number;
  numero: string;
  serie: string;
  chaveNFe: string | null;
  dataEmissao: string;
  emitenteNome: string;
  emitenteCNPJ: string;
  destNome: string;
  destCNPJ: string;
  valorTotal: number;
  items: NfeDetailItem[];
}

@Component({
  selector: 'app-nfe-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfe-details-modal.html',
  styleUrls: ['./nfe-details-modal.scss']
})
export class NfeDetailsModalComponent implements OnInit, OnChanges {
  @Input() nfeId: number | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  nfe: NfeDetail | null = null;
  loading = false;
  errorMessage = '';
  
  currentPage = 1;
  itemsPerPage = 50;
  Math = Math;

  constructor(
    private nfeService: NfeService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Initial load if modal is already open
    if (this.nfeId && this.isOpen) {
      this.loadDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Trigger load when modal opens (isOpen changes to true)
    if (changes['isOpen']) {
      if (this.isOpen && this.nfeId) {
        this.nfe = null; // Reset data
        this.currentPage = 1; // Reset pagination
        this.cdr.detectChanges(); // Forçar detecção
        this.loadDetails();
      }
    }
    // Trigger load when nfeId changes while modal is open
    else if (changes['nfeId'] && this.nfeId && this.isOpen) {
      this.nfe = null; // Reset data
      this.currentPage = 1; // Reset pagination
      this.cdr.detectChanges(); // Forçar detecção
      this.loadDetails();
    }
  }

  loadDetails() {
    if (!this.nfeId || this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.nfe = null;
    
    // Forçar detecção antes de carregar
    this.cdr.detectChanges();
    
    this.nfeService
      .getNfeDetails(this.nfeId)
      .pipe(finalize(() => {
        this.loading = false;
        // Forçar detecção após finalizar
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.nfe = response as NfeDetail;
          this.currentPage = 1;
          
          // Forçar detecção após receber dados
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Erro ao carregar detalhes';
          this.toastr.error(this.errorMessage);
          
          // Forçar detecção após erro
          this.cdr.detectChanges();
        }
      });
  }

  closeModal() {
    this.close.emit();
    this.nfe = null;
    this.errorMessage = '';
    this.currentPage = 1;
    
    // Forçar detecção ao fechar modal
    this.cdr.detectChanges();
  }

  get paginatedItems(): NfeDetailItem[] {
    if (!this.nfe?.items) return [];
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.nfe.items.slice(start, end);
  }

  get totalPages(): number {
    if (!this.nfe?.items) return 1;
    return Math.max(1, Math.ceil(this.nfe.items.length / this.itemsPerPage));
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      
      // Forçar detecção ao mudar página
      this.cdr.detectChanges();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      
      // Forçar detecção ao mudar página
      this.cdr.detectChanges();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  trackByItemId(_: number, item: NfeDetailItem): number {
    return item.id;
  }
}
