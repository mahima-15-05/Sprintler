# To provide a user-friendly message before insertion and also handle race conditions where two requests try to register at the same time. use error.code === 11000

# Situation	Status Code

# -------------------------------------------
# User registered	         201
# User logged in	         200
# Missing input	             400
# Invalid credentials	     401
# Email already exists	     409
# Resource not found	     404
# Not allowed (wrong role)	 403
# Server crash	             500
# -------------------------------------------


# A task can be deleted by:--
✅ Project Admin
✅ User assigned to that task