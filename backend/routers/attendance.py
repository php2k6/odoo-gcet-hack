from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from typing import Optional
from datetime import date, datetime
from database.database import get_db
from database.models import Employee, Attendance, Summary
from schemas.attendance import (
    AttendanceRecord, CompanyAttendanceResponse, 
    EmployeeAttendanceResponse, SummaryResponse,
    CheckInResponse, CheckOutResponse
)
from auth.auth import get_current_company, get_current_employee, decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/attendance", tags=["Attendance"])
token_auth_scheme = HTTPBearer()


def update_employee_status(employee: Employee, db: Session):
    """
    Update employee current_status based on today's attendance record
    Status values:
    - 0: Default/Checked out (complete attendance)
    - 1: Checked in (incomplete attendance - only check-in)
    - 2: On leave
    """
    today = date.today()
    
    # Get today's attendance record
    attendance = db.query(Attendance).filter(
        Attendance.emp_id == employee.id,
        Attendance.date == today
    ).first()
    
    if not attendance:
        # No record for today
        employee.current_status = 0
    elif attendance.on_leave:
        # On leave
        employee.current_status = 2
    elif attendance.end_time is None:
        # Checked in but not checked out (incomplete)
        employee.current_status = 1
    else:
        # Complete attendance (both check-in and check-out)
        employee.current_status = 0
    
    db.commit()


@router.get("/company")
async def get_company_attendance(
    date_param: date = Query(..., alias="date", description="Date for attendance (YYYY-MM-DD)"),
    current_company = Depends(get_current_company),
    db: Session = Depends(get_db)
) -> CompanyAttendanceResponse:
    """
    Get all attendance records for a specific date (Company/Admin only)
    Query param: date (YYYY-MM-DD)
    """
    
    # Get all employees for this company
    all_employees = db.query(Employee).filter(Employee.company_id == current_company.id).all()
    total_employees = len(all_employees)
    
    # Get attendance records for the specific date
    attendance_records = db.query(Attendance).join(Employee).filter(
        Employee.company_id == current_company.id,
        Attendance.date == date_param
    ).all()
    
    # Build response records with employee details
    records = []
    for attendance in attendance_records:
        employee = db.query(Employee).filter(Employee.id == attendance.emp_id).first()
        records.append(AttendanceRecord(
            emp_id=attendance.emp_id,
            date=attendance.date,
            start_time=attendance.start_time,
            end_time=attendance.end_time,
            work_hours=attendance.work_hours,
            extra_hours=attendance.extra_hours,
            on_leave=attendance.on_leave,
            employee_name=employee.name if employee else None,
            department=employee.department if employee else None
        ))
    
    # Calculate counts
    present_count = sum(1 for r in records if not r.on_leave)
    on_leave_count = sum(1 for r in records if r.on_leave)
    absent_count = total_employees - len(records)
    
    return CompanyAttendanceResponse(
        date=date_param,
        total_employees=total_employees,
        present_count=present_count,
        absent_count=absent_count,
        on_leave_count=on_leave_count,
        records=records
    )


@router.get("/employee")
async def get_employee_attendance(
    month: str = Query(..., description="Month for attendance (YYYY-MM)"),
    current_employee = Depends(get_current_employee),
    db: Session = Depends(get_db)
) -> EmployeeAttendanceResponse:
    """
    Get attendance records and summary for a specific month (Employee only)
    Query param: month (YYYY-MM format, e.g., 2026-01)
    """
    
    try:
        # Parse month string (YYYY-MM)
        year, month_num = map(int, month.split('-'))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid month format. Use YYYY-MM (e.g., 2026-01)"
        )
    
    # Get summary data
    summary = db.query(Summary).filter(Summary.emp_id == current_employee.id).first()
    
    # Get attendance records for the specified month
    attendance_records = db.query(Attendance).filter(
        Attendance.emp_id == current_employee.id,
        extract('year', Attendance.date) == year,
        extract('month', Attendance.date) == month_num
    ).order_by(Attendance.date).all()
    
    # Build attendance records
    records = [
        AttendanceRecord(
            emp_id=attendance.emp_id,
            date=attendance.date,
            start_time=attendance.start_time,
            end_time=attendance.end_time,
            work_hours=attendance.work_hours,
            extra_hours=attendance.extra_hours,
            on_leave=attendance.on_leave
        )
        for attendance in attendance_records
    ]
    
    # Build summary response
    summary_response = None
    if summary:
        summary_response = SummaryResponse(
            emp_id=summary.emp_id,
            present_days=summary.present_days,
            leave_count=summary.leave_count,
            leave_left=summary.leave_left,
            tot_work_days=summary.tot_work_days
        )
    
    return EmployeeAttendanceResponse(
        emp_id=current_employee.id,
        month=month,
        summary=summary_response,
        attendance_records=records
    )


@router.post("/checkin", response_model=CheckInResponse)
async def check_in(
    current_employee = Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    """
    Employee check-in endpoint
    Creates attendance record for current date if not exists
    Updates employee current_status to 1 (checked in)
    """
    today = date.today()
    
    # Check if attendance record already exists for today
    existing_record = db.query(Attendance).filter(
        Attendance.emp_id == current_employee.id,
        Attendance.date == today
    ).first()
    
    if existing_record:
        # Record already exists, check status
        update_employee_status(current_employee, db)
        return CheckInResponse(
            message="Already checked in for today",
            emp_id=current_employee.id,
            date=today,
            check_in_time=existing_record.start_time,
            current_status=current_employee.current_status
        )
    
    # Create new attendance record
    now = datetime.now()
    new_attendance = Attendance(
        emp_id=current_employee.id,
        date=today,
        start_time=now,
        end_time=None,
        work_hours=None,
        extra_hours=None,
        on_leave=False
    )
    
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    
    # Update employee status based on attendance record
    update_employee_status(current_employee, db)
    
    return CheckInResponse(
        message="Checked in successfully",
        emp_id=current_employee.id,
        date=today,
        check_in_time=now,
        current_status=current_employee.current_status
    )


@router.post("/checkout", response_model=CheckOutResponse)
async def check_out(
    current_employee = Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    """
    Employee check-out endpoint
    Updates attendance record with checkout time, calculates work hours and extra hours
    Updates summary table and employee current_status to 0
    """
    today = date.today()
    
    # Find incomplete attendance record (checkin without checkout) for today
    attendance_record = db.query(Attendance).filter(
        Attendance.emp_id == current_employee.id,
        Attendance.date == today,
        Attendance.end_time == None
    ).first()
    
    if not attendance_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No incomplete check-in found for today. Please check in first."
        )
    
    # Update checkout time
    now = datetime.now()
    attendance_record.end_time = now
    
    # Calculate work hours (in hours as float)
    time_diff = now - attendance_record.start_time
    work_hours_float = time_diff.total_seconds() / 3600
    
    # Calculate extra hours (anything beyond 8 hours)
    extra_hours_float = max(0, work_hours_float - 8)
    
    # Store as datetime for database compatibility (you may want to change column type to FLOAT)
    # For now, we'll use a workaround by storing as timestamp
    attendance_record.work_hours = now  # This should ideally be a float column
    attendance_record.extra_hours = now  # This should ideally be a float column
    
    # Update or create summary
    summary = db.query(Summary).filter(Summary.emp_id == current_employee.id).first()
    
    # Calculate statistics
    present_days = db.query(func.count(Attendance.emp_id)).filter(
        Attendance.emp_id == current_employee.id,
        Attendance.on_leave == False
    ).scalar() or 0
    
    leave_count = db.query(func.count(Attendance.emp_id)).filter(
        Attendance.emp_id == current_employee.id,
        Attendance.on_leave == True
    ).scalar() or 0
    
    leave_left = 30 - leave_count
    tot_work_days = present_days + leave_count
    
    if summary:
        # Update existing summary
        summary.present_days = present_days
        summary.leave_count = leave_count
        summary.leave_left = leave_left
        summary.tot_work_days = tot_work_days
    else:
        # Create new summary
        new_summary = Summary(
            emp_id=current_employee.id,
            present_days=present_days,
            leave_count=leave_count,
            leave_left=leave_left,
            tot_work_days=tot_work_days
        )
        db.add(new_summary)
    db.commit()
    db.refresh(attendance_record)
    
    # Update employee status based on attendance record
    update_employee_status(current_employee, db)
    
    return CheckOutResponse(
        message="Checked out successfully",
        emp_id=current_employee.id,
        date=today,
        check_in_time=attendance_record.start_time,
        check_out_time=now,
        work_hours=work_hours_float,
        extra_hours=extra_hours_float,
        current_status=current_employee.current_statusa_hours_float,
        current_status=0
    )
