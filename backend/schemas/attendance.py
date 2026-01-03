from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# Attendance Record Schema
class AttendanceRecord(BaseModel):
    emp_id: str
    date: date
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    work_hours: Optional[datetime] = None
    extra_hours: Optional[datetime] = None
    on_leave: Optional[bool] = None
    employee_name: Optional[str] = None
    department: Optional[str] = None
    
    class Config:
        from_attributes = True


# Summary Schema
class SummaryResponse(BaseModel):
    emp_id: str
    present_days: Optional[int] = None
    leave_count: Optional[int] = None
    leave_left: Optional[int] = None
    tot_work_days: Optional[int] = None
    
    class Config:
        from_attributes = True


# Company Attendance Response (for a specific date)
class CompanyAttendanceResponse(BaseModel):
    date: date
    total_employees: int
    present_count: int
    absent_count: int
    on_leave_count: int
    records: List[AttendanceRecord]


# Employee Attendance Response (for a specific month)
class EmployeeAttendanceResponse(BaseModel):
    emp_id: str
    month: str
    summary: Optional[SummaryResponse] = None
    attendance_records: List[AttendanceRecord]


# Check-in/Check-out Response
class CheckInResponse(BaseModel):
    message: str
    emp_id: str
    date: date
    check_in_time: datetime
    current_status: int


class CheckOutResponse(BaseModel):
    message: str
    emp_id: str
    date: date
    check_in_time: datetime
    check_out_time: datetime
    work_hours: float  # in hours
    extra_hours: float  # in hours
    current_status: int


# Employee Status Response
class EmployeeStatusResponse(BaseModel):
    emp_id: str
    current_status: int
    status_description: str
