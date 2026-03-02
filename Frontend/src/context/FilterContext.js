import React, { createContext, useState, useContext, useEffect } from 'react';
import departmentService from '../services/departmentService';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState(['All Departments']);
  const [types] = useState(['All Types', 'Manual', 'Subscription']);
  const [statuses] = useState(['All Statuses', 'Active', 'Expiring soon', 'Expired']);
  const [renewalTypes] = useState(['Normal', 'Subscription', 'Manual']);
  const [roles] = useState([
    { value: 'Admin', label: 'Admin - Full access', color: 'error' },
    { value: 'Editor', label: 'Editor - Edit licenses', color: 'primary' },
    { value: 'Viewer', label: 'Viewer - Only view', color: 'default' },
    { value: 'Licenseuser', label: 'Licenseuser - License user', color: 'success' }
  ]);

  const loadDepartments = async () => {
    try {
      const depts = await departmentService.getAllDepartments();
      setDepartments(depts);
      setDepartmentFilters(['All Departments', ...depts.map(d => d.name)]);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  // Initial laden
  useEffect(() => {
    loadDepartments();
  }, []);

  const refreshDepartments = () => {
    loadDepartments();
  };

  return (
    <FilterContext.Provider value={{
      departments,
      departmentFilters,
      types,
      statuses,
      renewalTypes,
      roles,
      refreshDepartments
    }}>
      {children}
    </FilterContext.Provider>
  );
};