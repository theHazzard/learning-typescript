abstract class Department {
  static fiscalYear = 2022;
  protected employees: string[] = [];

  constructor(protected readonly id: string, public name: string) {
  }

  static createEmployee(name: string) {
    return {name: name};
  }

  abstract describe(): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployees() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(id: string, public admins: string[]) { // by ading public it will create the property for me
    super(id, 'IT');
    // if I do not add the public above I can do this.admins = admins here, declaring the admins properties outside the constructor
  }

  describe(): void {
    console.log(`IT Department - ID: ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  private constructor(id: string, private reports: string[] = []) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  static getInstance(): AccountingDepartment {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new AccountingDepartment('d2', []);
    return this.instance;
  }

  describe(): void {
    console.log(`Accounting Department - ID: ${this.id}`);
  }

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }

    throw new Error('No report found');
  }

  set mostRecentReport(text: string) {
    if (!text) {
      throw new Error('Please pass in a valid value');
    }
    this.addReport(text);
  }


  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printReports() {
    console.log(this.reports);
  }
}

const emplyee1 = Department.createEmployee('Enzo');
console.log(emplyee1);
console.log(Department.fiscalYear);

// const accounting = new Department('d1', 'Accounting'); /// abstract classes cannot be instantiated
const it = new ITDepartment('d1', ['Enzo', 'Laura']);

// using a singleton by a private constructor
const accountingExtended = AccountingDepartment.getInstance();

// accounting.describe();
// accounting.addEmployee('Enzo');
// accounting.addEmployee('Laura');
// accounting.addEmployee('Hopper');
// accounting.printEmployees();

it.describe();
it.addEmployee('Hopper');
it.printEmployees();

accountingExtended.addReport('Some report');
accountingExtended.addEmployee('Laura');
accountingExtended.printReports();
accountingExtended.mostRecentReport = 'last report';
console.log(accountingExtended.mostRecentReport);

console.log(it);
console.log(accountingExtended);

accountingExtended.describe();
it.describe();