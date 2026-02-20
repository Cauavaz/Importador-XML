import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NfeService } from '../../services/nfe.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
import { NfeRefreshService } from '../../services/nfe-refresh.service';
import { NfeDetailsModalComponent } from '../../components/nfe-details-modal/nfe-details-modal';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal';

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
  imports: [CommonModule, NfeDetailsModalComponent, DeleteConfirmationModalComponent],
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
  
  isDeleteModalOpen = false;
  nfeToDelete: NfeListItem | null = null;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nfeService: NfeService,
    private toastr: ToastrService,
    private nfeRefreshService: NfeRefreshService,
    private cdr: ChangeDetectorRef,
  ) { }
  
  ngOnInit() {
    this.loadNfes();
    
    this.refreshSubscription = this.nfeRefreshService.refreshNotas$.subscribe(() => {
      this.currentPage = 1;
      this.loadNfes();
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
    this.cdr.detectChanges();
    
    this.nfeService
      .listNfes(this.currentPage, this.limit)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.nfes = [...(response?.data || [])] as NfeListItem[];
          this.total = Number(response?.total || 0);
          this.totalPages = Number(response?.totalPages || 1);
          this.currentPage = Number(response?.page || 1);
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastr.error('Não foi possível carregar as notas.');
          this.nfes = [];
          this.total = 0;
          this.totalPages = 1;
          this.cdr.detectChanges();
        }
      });
  }
  
  navigateToUpload() {
    this.router.navigate(['/dashboard/upload']);
  }
  
  viewDetails(nfeId: number) {
    this.selectedNfeId = nfeId;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedNfeId = null;
    this.cdr.detectChanges();
  }

  openDeleteModal(nfe: NfeListItem) {
    this.nfeToDelete = nfe;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.nfeToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (!this.nfeToDelete) {
      return;
    }

    const nfeId = this.nfeToDelete.id;
    this.closeDeleteModal();
    this.cdr.detectChanges();
    
    this.nfeService.deleteNfe(nfeId).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'NF-e excluída com sucesso');
        
        this.nfes = [...this.nfes.filter(n => n.id !== nfeId)];
        this.total = Math.max(0, this.total - 1);
        this.cdr.detectChanges();
        this.loadNfes();
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || 'Erro ao excluir NF-e');
        this.cdr.detectChanges();
      }
    });
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
      this.loadNfes();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
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
