import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useMatch } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const match = useMatch(rest.path);

  if (loading) {
    return null; 
  }

  if (!isAuthenticated) {
    navigate("/login"); 
    return null;
  }

  if (isAdmin && user.role !== "admin") {
    navigate("/login"); 
    return null;
  }

  return (
    <Fragment>
      {match && <Element />}
    </Fragment>
  );
};

export default ProtectedRoute;
