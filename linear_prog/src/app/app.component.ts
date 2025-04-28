import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './services/service.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface Line {
  m: number;
  b: number;
}

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent {

  lineForm!: FormGroup;
  lines: Line[] = [];

  constructor(private fb: FormBuilder, private serviceService: ServiceService) {}

  ngOnInit() {
    this.lineForm = this.fb.group({
      m: [0, Validators.required],
      b: [0, Validators.required]
    });
  }

  addLine() {
    if (this.lineForm.valid) {
      this.lines.push({ ...this.lineForm.value });
      this.lineForm.reset({ m: 0, b: 0 });
    }
  }

  removeLine(index: number) {
    this.lines.splice(index, 1);
  }

  title = 'linear_prog';
}
