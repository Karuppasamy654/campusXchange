from fastapi import HTTPException, status

class EntityNotFoundException(HTTPException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "ENTITY_NOT_FOUND",
                "message": f"{entity_name} with id '{entity_id}' was not found."
            }
        )

class ResourceUnavailableException(HTTPException):
    def __init__(self, message: str = "This resource is currently unavailable."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "RESOURCE_UNAVAILABLE",
                "message": message
            }
        )

class UnauthorizedException(HTTPException):
    def __init__(self, message: str = "Could not validate credentials."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": "UNAUTHORIZED",
                "message": message
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

class InsufficientPermissionsException(HTTPException):
    def __init__(self, message: str = "Operation not permitted for your user role."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "FORBIDDEN",
                "message": message
            }
        )
