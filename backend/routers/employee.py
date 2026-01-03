from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import Employee, Company, PrivateInfo, Salary, Resume, Summary, Attendance, LeaveTable
from schemas.employee import (
    EmployeesListResponse, EmployeeCreate, EmployeeCreateResponse, 
    EmployeeDetailResponse, EmployeeUpdate, ResumeUpdate, ResumeResponse,
    SalaryUpdate, SalaryResponse, EmployeeResponse, PasswordUpdate
)
from auth.auth import get_current_company, get_password_hash
from auth.user_dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/employees", tags=["Employees"])


def generate_employee_id(db: Session, company_name: str, full_name: str, year: int) -> tuple[str, int]:
    """
    Generate employee ID in format: [Company][Name][Year][Serial]
    Example: NIPA20220001 (from Nisarg Panchal)
    """
    # Get first 2 letters of company name
    company_code = company_name[:2].upper()
    
    # Split full name and get first 2 letters from each part
    name_parts = full_name.strip().split()
    if len(name_parts) >= 2:
        # Take first 2 letters of first name and first 2 letters of last name
        name_code = (name_parts[0][:2] + name_parts[1][:2]).upper()
    else:
        # If only one name, take first 4 letters
        name_code = name_parts[0][:4].upper().ljust(4, 'X')
    
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
    This will be hashed before storing in database
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
    
    # Extract year from doj (date of joining)
    year_of_joining = employee_data.private_info.doj.year
    
    # Generate employee ID and password
    employee_id, serial = generate_employee_id(
        db,
        current_company.company_name,
        employee_data.name,
        year_of_joining
    )
    password = generate_password(employee_id)
    
    try:
        # Create employee
        new_employee = Employee(
            id=employee_id,
            company_id=current_company.id,
            name=employee_data.name,
            password=get_password_hash(password),
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
            "name": employee_data.name,
            "email": employee_data.email,
            "message": "Employee created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create employee: {str(e)}"
        )


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


@router.put("/{emp_id}", response_model=EmployeeResponse)
async def update_employee(
    emp_id: str,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Update employee basic information only
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
    
    # Get update data
    update_data = employee_data.model_dump(exclude_unset=True)
    
    # Check email uniqueness if email is being updated
    if "email" in update_data and update_data["email"] != employee.email:
        existing = db.query(Employee).filter(Employee.email == update_data["email"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Update employee fields
    for key, value in update_data.items():
        setattr(employee, key, value)
    
    try:
        db.commit()
        db.refresh(employee)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update employee: {str(e)}"
        )
    
    return employee


@router.put("/{emp_id}/resume", response_model=ResumeResponse)
async def update_employee_resume(
    emp_id: str,
    resume_data: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Update employee resume details
    Accessible by: Admin (company) or the employee themselves
    """
    # Fetch employee
    employee = db.query(Employee).filter(Employee.id == emp_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Authorization check: user must be either admin or the employee themselves
    if current_user["user_type"] == "company":
        # Admin can update any employee in their company
        if str(employee.company_id) != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Employee belongs to different company"
            )
    elif current_user["user_type"] == "employee":
        # Employee can only update their own resume
        if employee.id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only update your own resume"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get update data
    update_data = resume_data.model_dump(exclude_unset=True)
    
    # Fetch or create resume
    resume = db.query(Resume).filter(Resume.emp_id == emp_id).first()
    
    if resume:
        # Update existing resume
        for key, value in update_data.items():
            setattr(resume, key, value)
    else:
        # Create new resume
        resume = Resume(
            emp_id=emp_id,
            **update_data
        )
        db.add(resume)
    
    try:
        db.commit()
        db.refresh(resume)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update resume: {str(e)}"
        )
    
    return resume


@router.put("/{emp_id}/salary", response_model=SalaryResponse)
async def update_employee_salary(
    emp_id: str,
    salary_data: SalaryUpdate,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Update employee salary details
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
    
    # Get update data
    update_data = salary_data.model_dump(exclude_unset=True)
    
    # Fetch or create salary
    salary = db.query(Salary).filter(Salary.emp_id == emp_id).first()
    
    if salary:
        # Update existing salary
        for key, value in update_data.items():
            setattr(salary, key, value)
    else:
        # Create new salary
        salary = Salary(
            emp_id=emp_id,
            **update_data
        )
        db.add(salary)
    
    try:
        db.commit()
        db.refresh(salary)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update salary: {str(e)}"
        )
    
    return salary


@router.delete("/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    emp_id: str,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company)
):
    """
    Delete employee and all related data
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
    
    # Delete employee (cascade will delete all related records)
    try:
        db.delete(employee)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete employee: {str(e)}"
        )
    
    return None


@router.put("/{emp_id}/password")
async def update_employee_password(
    emp_id: str,
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Update employee password
    Accessible by: Admin (company) or the employee themselves
    """
    # Fetch employee
    employee = db.query(Employee).filter(Employee.id == emp_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Authorization check: user must be either admin or the employee themselves
    if current_user["user_type"] == "company":
        # Admin can update any employee in their company
        if str(employee.company_id) != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Employee belongs to different company"
            )
    elif current_user["user_type"] == "employee":
        # Employee can only update their own password
        if employee.id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only update your own password"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Hash and update password
    employee.password = get_password_hash(password_data.new_password)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update password: {str(e)}"
        )
    
    return {"message": "Password updated successfully"}
