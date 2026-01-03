from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class LeaveRequest(BaseModel):
    start_date: date
    end_date: int
    leave_type: str


class LeaveResponse(BaseModel):
    leave_id: int
    emp_id: str
    start_date: date
    end_date: int
    leave_type: str
    is_approved: bool
    
    class Config:
        from_attributes = True


class LeaveListResponse(BaseModel):
    leaves: List[LeaveResponse]
    count: int
