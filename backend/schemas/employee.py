from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime


class EmployeeResponse(BaseModel):
    id: str
    company_id: UUID
    name: str
    phone: Optional[str] = None
    department: Optional[str] = None
    email: EmailStr
    manager: Optional[str] = None
    location: Optional[str] = None
    job_position: Optional[str] = None
    prof_pic: Optional[bytes] = None
    current_status: Optional[int] = None
    
    class Config:
        from_attributes = True


class EmployeesListResponse(BaseModel):
    employees: list[EmployeeResponse]
    count: int


# Detailed response schemas
class PrivateInfoResponse(BaseModel):
    emp_id: str
    dob: Optional[date] = None
    address: Optional[str] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None
    martial_status: Optional[bool] = None
    doj: Optional[date] = None
    bank_acc_no: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    
    class Config:
        from_attributes = True


class SalaryResponse(BaseModel):
    emp_id: str
    monthly_wage: Optional[int] = None
    yearly_wage: Optional[int] = None
    basic_sal: Optional[int] = None
    hra: Optional[int] = None
    sa: Optional[int] = None
    perf_bonus: Optional[int] = None
    ita: Optional[int] = None
    fa: Optional[int] = None
    pf1: Optional[int] = None
    pf2: Optional[int] = None
    prof_tax: Optional[int] = None
    
    class Config:
        from_attributes = True


class ResumeResponse(BaseModel):
    emp_id: str
    about: Optional[int] = None
    skills: Optional[str] = None
    certification: Optional[str] = None
    
    class Config:
        from_attributes = True


class AttendanceResponse(BaseModel):
    emp_id: str
    date: date
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    work_hours: Optional[datetime] = None
    extra_hours: Optional[datetime] = None
    on_leave: Optional[bool] = None
    
    class Config:
        from_attributes = True


class LeaveResponse(BaseModel):
    leave_id: int
    emp_id: str
    start_date: Optional[date] = None
    leave_type: Optional[str] = None
    end_date: Optional[int] = None
    is_approved: Optional[bool] = None
    
    class Config:
        from_attributes = True


class SummaryResponse(BaseModel):
    emp_id: str
    present_days: Optional[int] = None
    leave_count: Optional[int] = None
    leave_left: Optional[int] = None
    tot_work_days: Optional[int] = None
    
    class Config:
        from_attributes = True


class EmployeeDetailResponse(BaseModel):
    employee: EmployeeResponse
    private_info: Optional[PrivateInfoResponse] = None
    salary: Optional[SalaryResponse] = None
    resume: Optional[ResumeResponse] = None
    attendance_records: List[AttendanceResponse] = []
    leave_records: List[LeaveResponse] = []
    summary: Optional[SummaryResponse] = None


# Create Employee Schemas
class PrivateInfoCreate(BaseModel):
    dob: date
    address: str
    nationality: str
    gender: str
    martial_status: bool
    doj: date
    bank_acc_no: str
    bank_name: str
    ifsc_code: str
    pan_no: str
    uan_no: str


class SalaryCreate(BaseModel):
    monthly_wage: int
    yearly_wage: int
    basic_sal: int
    hra: int
    sa: int
    perf_bonus: int
    ita: int
    fa: int
    pf1: int
    pf2: int
    prof_tax: int


class ResumeCreate(BaseModel):
    about: int
    skills: str
    certification: str


class EmployeeCreate(BaseModel):
    name: str
    first_name: str  # For ID generation
    last_name: str   # For ID generation
    year_of_joining: int  # For ID generation
    phone: str
    department: str
    email: EmailStr
    manager: str
    location: str
    job_position: str
    prof_pic: Optional[bytes] = None
    current_status: int = 1
    
    # Related data
    private_info: PrivateInfoCreate
    salary: SalaryCreate
    resume: Optional[ResumeCreate] = None


class EmployeeCreateResponse(BaseModel):
    id: str
    password: str
    name: str
    email: EmailStr
    message: str


# Update Employee Basic Info Only
class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    email: Optional[EmailStr] = None
    manager: Optional[str] = None
    location: Optional[str] = None
    job_position: Optional[str] = None
    prof_pic: Optional[bytes] = None
    current_status: Optional[int] = None


# Resume Update Schema
class ResumeUpdate(BaseModel):
    about: Optional[int] = None
    skills: Optional[str] = None
    certification: Optional[str] = None


# Salary Update Schema
class SalaryUpdate(BaseModel):
    monthly_wage: Optional[int] = None
    yearly_wage: Optional[int] = None
    basic_sal: Optional[int] = None
    hra: Optional[int] = None
    sa: Optional[int] = None
    perf_bonus: Optional[int] = None
    ita: Optional[int] = None
    fa: Optional[int] = None
    pf1: Optional[int] = None
    pf2: Optional[int] = None
    prof_tax: Optional[int] = None


# Password Update Schema
class PasswordUpdate(BaseModel):
    new_password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "new_password": "newSecurePassword123"
            }
        }
