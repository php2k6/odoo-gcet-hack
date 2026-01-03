from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import base64
from database.database import get_db
from database.models import Company, Employee
from schemas.auth import (
    CompanySignup, CompanyLogin, CompanyResponse,
    EmployeeLogin, EmployeeResponse, Token
)
from auth.auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_company, get_current_employee
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/company/signup", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def company_signup(
    company_data: CompanySignup,
    db: Session = Depends(get_db)
):
    """Company (Admin) signup endpoint"""
    # Check if email already exists
    existing_company = db.query(Company).filter(Company.email == company_data.email).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Convert base64 logo to bytes if provided
    logo_bytes = None
    if company_data.logo:
        try:
            logo_bytes = base64.b64decode(company_data.logo)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 logo format"
            )
    
    # Create new company
    new_company = Company(
        company_name=company_data.company_name,
        email=company_data.email,
        password=get_password_hash(company_data.password),
        phone=company_data.phone,
        logo=logo_bytes
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    # Prepare response
    response = CompanyResponse(
        id=str(new_company.id),
        company_name=new_company.company_name,
        email=new_company.email,
        phone=new_company.phone,
        logo=base64.b64encode(new_company.logo).decode('utf-8') if new_company.logo else None,
        role="admin"
    )
    
    return response


@router.post("/company/login", response_model=Token)
async def company_login(
    login_data: CompanyLogin,
    db: Session = Depends(get_db)
):
    """Company (Admin) login endpoint"""
    company = db.query(Company).filter(Company.email == login_data.email).first()
    
    if not company or not verify_password(login_data.password, company.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(company.id), "role": "admin"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin"
    }


@router.post("/company/logout")
async def company_logout():
    """Company (Admin) logout endpoint - Client should delete the token"""
    return {"message": "Successfully logged out"}


@router.get("/company/me", response_model=CompanyResponse)
async def get_company_profile(
    current_company: Company = Depends(get_current_company)
):
    """Get current company profile"""
    return CompanyResponse(
        id=str(current_company.id),
        company_name=current_company.company_name,
        email=current_company.email,
        phone=current_company.phone,
        logo=base64.b64encode(current_company.logo).decode('utf-8') if current_company.logo else None,
        role="admin"
    )


@router.post("/employee/login", response_model=Token)
async def employee_login(
    login_data: EmployeeLogin,
    db: Session = Depends(get_db)
):
    """Employee login endpoint"""
    employee = db.query(Employee).filter(Employee.id == login_data.id).first()
    
    if not employee or not verify_password(login_data.password, employee.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": employee.id, "role": "employee"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "employee"
    }


@router.post("/employee/logout")
async def employee_logout():
    """Employee logout endpoint - Client should delete the token"""
    return {"message": "Successfully logged out"}


@router.get("/employee/me", response_model=EmployeeResponse)
async def get_employee_profile(
    current_employee: Employee = Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    """Get current employee profile with all related data"""
    return EmployeeResponse(
        id=current_employee.id,
        company_id=str(current_employee.company_id),
        name=current_employee.name,
        phone=current_employee.phone,
        department=current_employee.department,
        email=current_employee.email,
        manager=current_employee.manager,
        location=current_employee.location,
        job_position=current_employee.job_position,
        prof_pic=current_employee.prof_pic,
        current_status=current_employee.current_status,
        role="employee",
        private_info=current_employee.private_info,
        resume_data=current_employee.resume_data,
        salary=current_employee.salary
    )
