import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NfeService } from '../../services/nfe.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
import { NfeRefreshService } from '../../services/nfe-refresh.service';
import { NfeDetailsModalComponent } from '../../components/nfe-details-modal/nfe-details-modal';

interface NfeListItem {
  id: number;
  numero: string;
  serie: string;
  dataEmissao: string;
  emitenteNome: string;
  emitenteCNPJ: string;
  valorTotal: number;
}

@Component({
  selector: 'app-notas-entrada',
  standalone: true,
  imports: [CommonModule, NfeDetailsModalComponent],
  templateUrl: './notas-entrada.html',
  styleUrls: ['./notas-entrada.scss']
})
export class NotasEntradaComponent implements OnInit, OnDestroy {
  nfes: NfeListItem[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  total = 0;
  limit = 50;
  Math = Math;
  private refreshSubscription?: Subscription;
  
  selectedNfeId: number | null = null;
  isModalOpen = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nfeService: NfeService,
    private toastr: ToastrService,
    private nfeRefreshService: NfeRefreshService,
  ) { }
  
  ngOnInit() {
    // Carrega dados após o ciclo de detecção de mudanças para evitar NG0100
    Promise.resolve().then(() => {
      this.loadNfes();
      
      // Segunda tentativa após 150ms (garante que funciona)
      setTimeout(() => {
        if (!this.loading && this.nfes.length === 0) {
          this.loadNfes();
        }
      }, 150);
    });
    
    // Também escuta eventos de refresh para recarregar quando necessário
    this.refreshSubscription = this.nfeRefreshService.refreshNotas$.subscribe(() => {
      this.currentPage = 1;
      Promise.resolve().then(() => {
        this.loadNfes();
        // Dispara segunda vez após delay
        setTimeout(() => {
          if (!this.loading && this.nfes.length === 0) {
            this.loadNfes();
          }
        }, 150);
      });
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }
  
  loadNfes() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.nfeService
      .listNfes(this.currentPage, this.limit)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.nfes = (response?.data || []) as NfeListItem[];
          this.total = Number(response?.total || 0);
          this.totalPages = Number(response?.totalPages || 1);
          this.currentPage = Number(response?.page || 1);
        },
        error: () => {
          this.toastr.error('Não foi possível carregar as notas.');
          this.nfes = [];
          this.total = 0;
          this.totalPages = 1;
        }
      });
  }
  
  navigateToUpload() {
    this.router.navigate(['/dashboard/upload']);
  }
  
  viewDetails(nfeId: number) {
    this.selectedNfeId = nfeId;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedNfeId = null;
  }

  deleteNfe(nfe: NfeListItem) {
    if (!confirm(`Tem certeza que deseja excluir a NF-e ${nfe.numero}/${nfe.serie}?`)) {
      return;
    }

    this.nfeService.deleteNfe(nfe.id).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'NF-e excluída com sucesso');
        
        // Remove da lista imediatamente (feedback visual instantâneo)
        this.nfes = this.nfes.filter(n => n.id !== nfe.id);
        this.total = Math.max(0, this.total - 1);
        
        // Recarrega do servidor para garantir sincronização
        setTimeout(() => {
          this.loading = false; // Garante que não está bloqueado
          this.loadNfes();
        }, 100);
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || 'Erro ao excluir NF-e');
      }
    });
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadNfes();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadNfes();
    }
  }

  trackByNfeId(_: number, nfe: NfeListItem): number {
    return nfe.id;
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
}
