from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from database.database import get_db
from database.models import LeaveTable, Employee
from schemas.leave import LeaveRequest, LeaveResponse, LeaveListResponse
from auth.user_dependencies import get_current_user

router = APIRouter(prefix="/leaves", tags=["Leaves"])


@router.post("/request", response_model=LeaveResponse, status_code=status.HTTP_201_CREATED)
async def request_leave(
    leave_data: LeaveRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Request leave - Employee submits leave request
    Employee can only request leave for themselves (emp_id from token)
    By default is_approved is False until admin approves
    """
    # Get employee ID from token
    emp_id = current_user["user_id"]
    
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == emp_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Create leave request
    new_leave = LeaveTable(
        emp_id=emp_id,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        leave_type=leave_data.leave_type,
        is_approved=False  # Default to False
    )
    
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    
    return new_leave


@router.get("/admin", response_model=LeaveListResponse)
async def get_all_leaves_admin(
    status_filter: Optional[str] = Query(None, description="Filter by status: pending, approved"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all leave requests for admin
    Admin only - returns all employees' leave requests
    Optional filter: ?status=pending or ?status=approved
    """
    # Check if user is admin
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can access all leave requests"
        )
    
    # Build query
    query = db.query(LeaveTable)
    
    # Apply status filter if provided
    if status_filter:
        if status_filter.lower() == "pending":
            query = query.filter(LeaveTable.is_approved == False)
        elif status_filter.lower() == "approved":
            query = query.filter(LeaveTable.is_approved == True)
    
    leaves = query.all()
    
    return {"leaves": leaves, "count": len(leaves)}


@router.get("/emp", response_model=LeaveListResponse)
async def get_employee_leaves(
    status_filter: Optional[str] = Query(None, description="Filter by status: pending, approved"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get leave requests for current employee
    Employee can only see their own leave requests
    Optional filter: ?status=pending or ?status=approved
    """
    # Get employee ID from token
    emp_id = current_user["user_id"]
    
    # Build query for this employee only
    query = db.query(LeaveTable).filter(LeaveTable.emp_id == emp_id)
    
    # Apply status filter if provided
    if status_filter:
        if status_filter.lower() == "pending":
            query = query.filter(LeaveTable.is_approved == False)
        elif status_filter.lower() == "approved":
            query = query.filter(LeaveTable.is_approved == True)
    
    leaves = query.all()
    
    return {"leaves": leaves, "count": len(leaves)}


@router.put("/{leave_id}/approve", response_model=LeaveResponse)
async def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Approve a leave request
    Admin only
    """
    # Check if user is admin
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can approve leave requests"
        )
    
    # Find the leave request
    leave = db.query(LeaveTable).filter(LeaveTable.leave_id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Update is_approved to True
    leave.is_approved = True
    db.commit()
    db.refresh(leave)
    
    return leave


@router.put("/{leave_id}/reject", response_model=LeaveResponse)
async def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Reject a leave request
    Admin only
    """
    # Check if user is admin
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can reject leave requests"
        )
    
    # Find the leave request
    leave = db.query(LeaveTable).filter(LeaveTable.leave_id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Update is_approved to False
    leave.is_approved = False
    db.commit()
    db.refresh(leave)
    
    return leave
