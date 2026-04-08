import React, { useState } from 'react'

export const SuperAdminRoutes = () => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        userRole: null, // e.g., 'user', 'admin'
      });
  return (
    <div>SuperAdminRoutes</div>
  )
}
