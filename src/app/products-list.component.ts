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

  editingProduct = signal<Product | null>(null);
  editName = '';
  editPrice = 1;
  editCategory = '';

  constructor(public service: ProductsService) {}

  ngOnInit() {
    this.service.list().subscribe();
  }

  onProductAdded(newProduct: Product) {}

  onEdit(product: Product, event: Event) {
    event.stopPropagation();
    this.editingProduct.set(product);
    this.editName = product.title || product.name || '';
    this.editPrice = product.price;
    this.editCategory = product.category;
  }

  closeModal() {
    this.editingProduct.set(null);
  }

  saveEdit() {
    const product = this.editingProduct();
    if (!product) return;

    if (!this.editName.trim() || this.editPrice <= 0 || !this.editCategory) {
      alert('Будь ласка, заповніть усі поля коректно');
      return;
    }

    this.service.update(product.id, {
      name: this.editName.trim(),
      price: Number(this.editPrice),
      category: this.editCategory
    }).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert('Помилка при оновленні товару');
      }
    });
  }

  onDelete(product: Product, event: Event) {
    event.stopPropagation();
    if (!confirm(`Видалити "${product.title || product.name}"?`)) return;

    this.service.delete(product.id).subscribe({
      error: (err) => {
        console.error(err);
        alert('Помилка при видаленні товару');
      }
    });
  }

  filteredProducts = computed(() => {
    const category = this.selectedCategory().trim().toLowerCase();
    const list = this.service.allProducts();

    if (!category) {
      return list;
    }

    return list.filter(p => p.category && p.category.trim().toLowerCase() === category);
  });
}