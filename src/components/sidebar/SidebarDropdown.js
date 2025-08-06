import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const SidebarDropdown = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sidebar-dropdown ${open ? 'open' : ''}`}>
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        <h4>{title}</h4>
        <span className="arrow">▼</span>
      </div>
      <div className="dropdown-content">{children}</div>
    </div>
  );
};

export default SidebarDropdown;
