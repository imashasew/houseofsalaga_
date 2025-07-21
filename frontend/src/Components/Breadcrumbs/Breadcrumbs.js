import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ paths = [] }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="breadcrumbs">
      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        const path = '/' + paths
          .slice(0, idx + 1)
          .map(part => part.toLowerCase().replace(/\s+/g, '-'))
          .join('/');

        return (
          <span key={idx}>
            {isLast ? (
              // Reload page on current active breadcrumb click
              <Link to={currentPath} onClick={() => window.location.reload()}>
                {p}
              </Link>
            ) : (
              <Link to={path}>{p}</Link>
            )}
            {idx < paths.length - 1 && <span className="sep">{">"}</span>}
          </span>
        );
      })}
    </nav>
  );
}
