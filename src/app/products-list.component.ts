import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService, Product } from './products.service';
import { ProductFormComponent } from './product-form.component';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [FormsModule, RouterModule, ProductFormComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  selectedCategory = signal<string>('');
  categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

  constructor(public service: ProductsService) {}

  ngOnInit() {
    this.service.list().subscribe();
  }

  onProductAdded(newProduct: Product) {}

  filteredProducts = computed(() => {
    const category = this.selectedCategory().trim().toLowerCase();
    const list = this.service.allProducts();

    if (!category) {
      return list;
    }

    return list.filter(p => p.category && p.category.trim().toLowerCase() === category);
  });
}