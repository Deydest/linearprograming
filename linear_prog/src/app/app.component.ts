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
import { provideHttpClient } from '@angular/common/http';


interface Constraint {
  coef: number[];
  operator: string;
  constant: number;
}

export interface OptimizationData {
  objective: {
    coef: number[];
    operator: string;
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
  styleUrl: './app.component.scss',
})
export class AppComponent {
  optimizationForm!: FormGroup;
  constraints: Constraint[] = [];
  displayedConstraints: string[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService) {}
  
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
          coef: [formValue.objective.x1, formValue.objective.x2],
          operator: formValue.objective.operator,
          constant: formValue.objective.constant
        },
        constraints: formValue.constraints.map((c: any) => ({
          coef: [c.x1, c.x2],
          operator: c.operator,
          constant: c.constant,
        }))
      };

      console.log(optimizationData);
  
      this.service.sendOptData(optimizationData).subscribe(response => {
        console.log('Resposta da API:', response);
      });
  
      this.updateDisplayedConstraints();
    }
  }

  resultado() {
    
    console.log('Mostrando resultados...');
  }

  updateDisplayedConstraints() {
    this.displayedConstraints = this.constraintsArray.controls.map((control, index) => {
      const constraint = control.value;
      return `${index + 1}. ${constraint.x1}x1 + ${constraint.x2}x2 ${constraint.operator} ${constraint.constant}`;
    });
  }
}
