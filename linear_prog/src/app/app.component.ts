import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { ServiceService } from './services/service.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

interface Constraint {
  x1: number;
  x2: number;
  operator: string;
  constant: number;
}

interface OptimizationData {
  objective: {
    x1: number;
    x2: number;
    constant: number;
  };
  constraints: Constraint[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  optimizationForm!: FormGroup;
  constraints: Constraint[] = [];
  displayedConstraints: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.optimizationForm = this.fb.group({
      objective: this.fb.group({
        x1: [0, Validators.required],
        x2: [0, Validators.required],
        constant: [0, Validators.required]
      }),
      constraints: this.fb.array([
        this.createConstraint()
      ])
    });
  }

  get constraintsArray(): FormArray {
    return this.optimizationForm.get('constraints') as FormArray;
  }

  createConstraint(): FormGroup {
    return this.fb.group({
      x1: [0, Validators.required],
      x2: [0, Validators.required],
      operator: ['<=', Validators.required],
      constant: [0, Validators.required]
    });
  }

  addConstraint() {
    this.constraintsArray.push(this.createConstraint());
  }

  removeConstraint(index: number) {
    this.constraintsArray.removeAt(index);
    this.updateDisplayedConstraints();
  }

  calcular() {
    if (this.optimizationForm.valid) {
      const formValue = this.optimizationForm.value;
      const optimizationData: OptimizationData = {
        objective: {
          x1: formValue.objective.x1,
          x2: formValue.objective.x2,
          constant: formValue.objective.constant
        },
        constraints: formValue.constraints
      };

      //console.log('Dados para cálculo:', optimizationData);
      // enviar os dados para o serviço
      // this.serviceService.calculate(optimizationData).subscribe(...);

      this.updateDisplayedConstraints();
    }
  }

  resultado() {
    // Implemente a lógica para mostrar os resultados
    console.log('Mostrando resultados...');
  }

  updateDisplayedConstraints() {
    this.displayedConstraints = this.constraintsArray.controls.map((control, index) => {
      const constraint = control.value;
      return `${index + 1}. ${constraint.x1}x1 + ${constraint.x2}x2 ${constraint.operator} ${constraint.constant}`;
    });
  }
}
