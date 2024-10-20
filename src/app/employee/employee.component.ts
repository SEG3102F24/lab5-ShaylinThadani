import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { EmployeeService } from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import { Employee } from "../model/employee";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule]
})
export class EmployeeComponent {
  private builder: FormBuilder = inject(FormBuilder);
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  
  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, Validators.required],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email]
  });



  get name(): AbstractControl<string> { return this.employeeForm.get('name') as AbstractControl<string>; }
  get dateOfBirth(): AbstractControl<string> { return this.employeeForm.get('dateOfBirth') as AbstractControl<string>; }
  get city(): AbstractControl<string> { return this.employeeForm.get('city') as AbstractControl<string>; }
  get salary(): AbstractControl<number> { return this.employeeForm.get('salary') as AbstractControl<number>; }
  get gender(): AbstractControl<string> { return this.employeeForm.get('gender') as AbstractControl<string>; }
  get email(): AbstractControl<string> { return this.employeeForm.get('email') as AbstractControl<string>; }

  onSubmit() {
    const employee: Employee = new Employee(
      this.name.value,
      new Date(this.dateOfBirth.value),
      this.city.value,
      this.salary.value,
      this.gender.value,
      this.email.value
    );
    this.employeeService.addEmployee(employee).then(() => {
      this.employeeForm.reset();
      this.router.navigate(['/employees']);
    }).catch(error => {
      console.error('Error adding employee:', error);
    });
  }
}