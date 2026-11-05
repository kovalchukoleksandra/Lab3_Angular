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
      this.service.create(this.form.value as any).subscribe(() => {
        alert('Товар успішно додано!');
        const createdProduct: Product = {
          id: Date.now(),
          title: this.form.value.name,
          price: Number(this.form.value.price),
          category: this.form.value.category,
          description: 'Це локально доданий товар.'
        };
        
        this.service.addLocalProduct(createdProduct);
        this.productAdded.emit(createdProduct);
        this.form.reset({ price: 1 });
      });
    }
  }
}