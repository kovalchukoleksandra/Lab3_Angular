import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService, Product } from './products.service';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.service.get(id).subscribe({
        next: (data) => this.product.set(data),
        error: () => this.errorMessage.set('Товар не знайдено!')
      });
    }
  }
}