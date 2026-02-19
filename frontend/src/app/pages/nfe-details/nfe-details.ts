import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  valorUnitarioFormatado?: string;
  valorTotalFormatado?: string;
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
  valorTotalFormatado?: string;
  items: NfeDetailItem[];
}

@Component({
  selector: 'app-nfe-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfe-details.html',
  styleUrls: ['./nfe-details.scss']
})
export class NfeDetailsComponent implements OnInit {
  nfe: NfeDetail | null = null;
  loading = true;
  errorMessage = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nfeService: NfeService,
    private toastr: ToastrService
  ) { }
  
  ngOnInit() {
    const nfeId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(nfeId) || nfeId <= 0) {
      this.errorMessage = 'ID da nota não encontrado na rota.';
      this.loading = false;
      return;
    }

    this.loadNfeDetails(nfeId);
  }
  
  loadNfeDetails(nfeId: number) {
    this.loading = true;
    this.errorMessage = '';
    this.nfeService
      .getNfeDetails(nfeId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const items = ((response?.items || []) as NfeDetailItem[]).map((item) => ({
            ...item,
            valorUnitarioFormatado: this.formatCurrency(item.valorUnitario),
            valorTotalFormatado: this.formatCurrency(item.valorTotal),
          }));

          this.nfe = {
            ...response,
            valorTotalFormatado: this.formatCurrency(response.valorTotal),
            items,
          };
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Erro ao carregar detalhes da nota.';
          this.toastr.error(this.errorMessage);
        }
      });
  }
  
  goBack() {
    this.router.navigate(['/dashboard/notas-entrada']);
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
  
  getUsername(): string {
    return sessionStorage.getItem('username') || 'Usuário';
  }

  trackByItemId(_: number, item: NfeDetailItem): number {
    return item.id;
  }
}
