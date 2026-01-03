from sqlalchemy import Column, Integer, BigInteger, String, Text, LargeBinary, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.database import Base
import uuid


class Company(Base):
    __tablename__ = "company"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    company_name = Column(Text, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    phone = Column(Text)
    logo = Column(LargeBinary)
    
    # Relationships
    employees = relationship("Employee", back_populates="company", cascade="all, delete-orphan")


class Employee(Base):
    __tablename__ = "employee"
    
    id = Column(String, primary_key=True, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("company.id"), nullable=False)
    name = Column(Text, nullable=False)
    password = Column(Text, nullable=False)
    phone = Column(Text)
    department = Column(Text)
    email = Column(String, unique=True, nullable=False)
    manager = Column(Text)
    location = Column(Text)
    job_position = Column(Text)
    prof_pic = Column(LargeBinary)
    current_status = Column(Integer)
    
    # Relationships
    company = relationship("Company", back_populates="employees")
    private_info = relationship("PrivateInfo", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    leave_records = relationship("LeaveTable", back_populates="employee", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    salary = relationship("Salary", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    resume_data = relationship("Resume", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="employee", uselist=False, cascade="all, delete-orphan")


class PrivateInfo(Base):
    __tablename__ = "private_info"
    
    emp_id = Column(String, ForeignKey("employee.id"), primary_key=True)
    dob = Column(Date)
    address = Column(Text)
    nationality = Column(Text)
    gender = Column(Text)
    martial_status = Column(Boolean)
    doj = Column(Date)
    bank_acc_no = Column(Text)
    bank_name = Column(Text)
    ifsc_code = Column(Text)
    pan_no = Column(Text)
    uan_no = Column(Text)
    
    # Relationships
    employee = relationship("Employee", back_populates="private_info")


class LeaveTable(Base):
    __tablename__ = "leave_table"
    
    leave_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String, ForeignKey("employee.id"), nullable=False)
    start_date = Column(Date)
    leave_type = Column(Text)
    end_date = Column(Date)
    is_approved = Column(Boolean)
    
    # Relationships
    employee = relationship("Employee", back_populates="leave_records")


class Attendance(Base):
    __tablename__ = "attendance"
    
    emp_id = Column(String, ForeignKey("employee.id"), primary_key=True)
    date = Column(Date, primary_key=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    work_hours = Column(DateTime)
    extra_hours = Column(DateTime)
    on_leave = Column(Boolean)
    
    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")


class Resume(Base):
    __tablename__ = "resume"
    
    emp_id = Column(String, ForeignKey("employee.id"), primary_key=True)
    about = Column(Text)
    skills = Column(Text)
    certification = Column(Text)
    
    # Relationships
    employee = relationship("Employee", back_populates="resume_data")


class Salary(Base):
    __tablename__ = "salary"
    
    emp_id = Column(String, ForeignKey("employee.id"), primary_key=True)
    monthly_wage = Column(BigInteger)
    yearly_wage = Column(BigInteger)
    basic_sal = Column(BigInteger)
    hra = Column(BigInteger)
    sa = Column(BigInteger)
    perf_bonus = Column(BigInteger)
    ita = Column(BigInteger)
    fa = Column(BigInteger)
    pf1 = Column(BigInteger)
    pf2 = Column(BigInteger)
    prof_tax = Column(BigInteger)
    
    # Relationships
    employee = relationship("Employee", back_populates="salary")


class Summary(Base):
    __tablename__ = "summary"
    
    emp_id = Column(String, ForeignKey("employee.id"), primary_key=True)
    present_days = Column(Integer)
    leave_count = Column(Integer)
    leave_left = Column(Integer)
    tot_work_days = Column(Integer)
    
    # Relationships
    employee = relationship("Employee", back_populates="summary")



