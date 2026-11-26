import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService, Product } from './products.service';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @Output() productAdded = new EventEmitter<Product>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ProductsService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.create(this.form.value as any).subscribe({
        next: (createdProduct) => {
          alert('Товар успішно додано!');
          this.productAdded.emit(createdProduct);
          this.form.reset({ price: 1 });
        },
        error: (err) => {
          console.error(err);
          alert('Помилка при додаванні товару');
        }
      });
    }
  }
}