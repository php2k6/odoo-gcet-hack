from fastapi import Header, HTTPException, status


async def verify_admin(authorization: str = Header(None)):
    """
    Verify if the user is an admin
    TODO: Implement JWT token verification
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    # TODO: Implement actual JWT verification and admin role check
    # For now, just check if header exists
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    # Placeholder - will implement actual admin verification later
    return {"role": "admin"}
