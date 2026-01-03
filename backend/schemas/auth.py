from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


# Company Schemas
class CompanySignup(BaseModel):
    company_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    logo: Optional[bytes] = None


class CompanyLogin(BaseModel):
    email: EmailStr
    password: str


class CompanyResponse(BaseModel):
    id: str
    company_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    logo: Optional[bytes] = None
    role: str = "admin"
    
    class Config:
        from_attributes = True


# Employee Schemas
class EmployeeLogin(BaseModel):
    id: str
    password: str


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


class ResumeResponse(BaseModel):
    emp_id: str
    about: Optional[int] = None
    skills: Optional[str] = None
    certification: Optional[str] = None
    column_0: Optional[int] = None
    
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


class EmployeeResponse(BaseModel):
    id: str
    company_id: str
    name: str
    phone: Optional[str] = None
    department: Optional[str] = None
    email: str
    manager: Optional[str] = None
    location: Optional[str] = None
    job_position: Optional[str] = None
    resume: Optional[str] = None
    prof_pic: Optional[bytes] = None
    current_status: Optional[int] = None
    role: str = "employee"
    private_info: Optional[PrivateInfoResponse] = None
    resume_data: Optional[ResumeResponse] = None
    salary: Optional[SalaryResponse] = None
    
    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
