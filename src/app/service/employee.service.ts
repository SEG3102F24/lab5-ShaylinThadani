import { Injectable } from '@angular/core';
import { Employee } from "../model/employee";
import { Firestore, collectionData, collection, addDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesCollection: CollectionReference<DocumentData>;
  employees$: Observable<Employee[]>;

  constructor(private firestore: Firestore) {
    this.employeesCollection = collection(this.firestore, 'employees');

    this.employees$ = collectionData(this.employeesCollection).pipe(
      map((employees: DocumentData[]) => employees.map(emp => {
        let dateOfBirth = emp['dateOfBirth'];

        if (dateOfBirth && dateOfBirth.toDate) {
          dateOfBirth = dateOfBirth.toDate();
        }

        return new Employee(
          emp['name'],
          dateOfBirth,
          emp['city'],
          emp['salary'],
          emp['gender'],
          emp['email']
        );
      }))
    );
  }

  get $(): Observable<Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Employee) {
    const employeeData = { ...employee };
    return addDoc(this.employeesCollection, employeeData);
  }
}