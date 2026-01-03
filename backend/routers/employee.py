from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import Employee, Company, PrivateInfo, Salary, Resume, Summary, Attendance, LeaveTable
from schemas.employee import (
    EmployeesListResponse, EmployeeCreate, EmployeeCreateResponse, EmployeeDetailResponse
)
from auth.auth import get_current_company
from datetime import datetime

router = APIRouter(prefix="/employees", tags=["Employees"])


def generate_employee_id(db: Session, company_name: str, first_name: str, last_name: str, year: int) -> tuple[str, int]:
    """
    Generate employee ID in format: [Company][Name][Year][Serial]
    Example: OIJODO20220001
    """
    # Get first 2 letters of company name
    company_code = company_name[:2].upper()
    
    # Get first 2 letters of first and last name
    name_code = (first_name[:2] + last_name[:2]).upper()
    
    # Get serial number for this year
    year_prefix = f"{company_code}{name_code}{year}"
    
    # Count existing employees with this year prefix
    count = db.query(Employee).filter(Employee.id.like(f"{year_prefix}%")).count()
    serial = count + 1
    
    # Generate ID
    employee_id = f"{year_prefix}{serial:04d}"
    
    return employee_id, serial


def generate_password(employee_id: str) -> str:
    """
    Generate password based on employee ID
    For now using the employee ID as password (should be hashed in production)
    """
    return employee_id


@router.get("/", response_model=EmployeesListResponse)
async def get_employees(
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Get all employees with all details except password
    Admin only
    """
    employees = db.query(Employee).all()
    
    return {"employees": employees, "count": len(employees)}


@router.post("/", response_model=EmployeeCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Create a new employee with all related data
    Admin only
    """
    # Check if email already exists
    existing_employee = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate employee ID and password
    employee_id, serial = generate_employee_id(
        db,
        current_company.company_name,
        employee_data.first_name,
        employee_data.last_name,
        employee_data.year_of_joining
    )
    password = generate_password(employee_id)
    
    # Create employee
    new_employee = Employee(
        id=employee_id,
        company_id=current_company.id,
        name=employee_data.name,
        password=password,  # TODO: Hash password in production
        phone=employee_data.phone,
        department=employee_data.department,
        email=employee_data.email,
        manager=employee_data.manager,
        location=employee_data.location,
        job_position=employee_data.job_position,
        prof_pic=employee_data.prof_pic,
        current_status=employee_data.current_status
    )
    
    db.add(new_employee)
    db.flush()  # Flush to make employee available for foreign keys
    
    # Create private info
    private_info = PrivateInfo(
        emp_id=employee_id,
        **employee_data.private_info.model_dump()
    )
    db.add(private_info)
    
    # Create salary
    salary = Salary(
        emp_id=employee_id,
        **employee_data.salary.model_dump()
    )
    db.add(salary)
    
    # Create resume if provided
    if employee_data.resume:
        resume = Resume(
            emp_id=employee_id,
            **employee_data.resume.model_dump()
        )
        db.add(resume)
    
    # Create summary with default values
    summary = Summary(
        emp_id=employee_id,
        present_days=0,
        leave_count=0,
        leave_left=20,  # Default 20 leaves
        tot_work_days=0
    )
    db.add(summary)
    
    # Commit all changes
    db.commit()
    db.refresh(new_employee)
    
    return {
        "id": employee_id,
        "password": password,
        "name": employee_data.name,
        "email": employee_data.email,
        "message": "Employee created successfully"
    }


@router.get("/{emp_id}", response_model=EmployeeDetailResponse)
async def get_employee_details(
    emp_id: str,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Get complete employee details including all related data
    Admin only
    """
    # Fetch employee
    employee = db.query(Employee).filter(Employee.id == emp_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Verify employee belongs to the current company
    if employee.company_id != current_company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Employee belongs to different company"
        )
    
    # Fetch all related data
    private_info = db.query(PrivateInfo).filter(PrivateInfo.emp_id == emp_id).first()
    salary = db.query(Salary).filter(Salary.emp_id == emp_id).first()
    resume = db.query(Resume).filter(Resume.emp_id == emp_id).first()
    attendance_records = db.query(Attendance).filter(Attendance.emp_id == emp_id).all()
    leave_records = db.query(LeaveTable).filter(LeaveTable.emp_id == emp_id).all()
    summary = db.query(Summary).filter(Summary.emp_id == emp_id).first()
    
    return {
        "employee": employee,
        "private_info": private_info,
        "salary": salary,
        "resume": resume,
        "attendance_records": attendance_records,
        "leave_records": leave_records,
        "summary": summary
    }
