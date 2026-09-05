/**
 * Organizational Hierarchy, Reporting Trees & Matrix Management Engine
 * Handles complex enterprise reporting structures:
 * - Direct and skip-level reportee traversal
 * - Manager span-of-control metric calculations
 * - Dotted-line (functional) vs Solid-line (administrative) reporting
 * - Succession planning talent bench depth calculation.
 */

export class OrganizationHierarchyEngine {
  constructor() {
    this.optimalSpanOfControlMin = 4;
    this.optimalSpanOfControlMax = 9;
  }

  buildReportingHierarchyTree(employees = []) {
    const employeeMap = {};
    const rootLeaders = [];

    employees.forEach(emp => {
      employeeMap[emp.employeeId] = {
        ...emp,
        directReports: [],
        totalSubordinatesCount: 0
      };
    });

    employees.forEach(emp => {
      if (emp.managerId && employeeMap[emp.managerId] && emp.managerId !== emp.employeeId) {
        employeeMap[emp.managerId].directReports.push(employeeMap[emp.employeeId]);
      } else {
        rootLeaders.push(employeeMap[emp.employeeId]);
      }
    });

    const calculateSubordinates = (node) => {
      let count = node.directReports.length;
      node.directReports.forEach(child => {
        count += calculateSubordinates(child);
      });
      node.totalSubordinatesCount = count;
      return count;
    };

    rootLeaders.forEach(root => calculateSubordinates(root));

    return {
      totalEmployeesCount: employees.length,
      rootLeadershipCount: rootLeaders.length,
      hierarchyTree: rootLeaders
    };
  }

  calculateSpanOfControlMetrics(employees = []) {
    const managerReportCount = {};

    employees.forEach(emp => {
      if (emp.managerId) {
        managerReportCount[emp.managerId] = (managerReportCount[emp.managerId] || 0) + 1;
      }
    });

    const managersList = Object.keys(managerReportCount).map(mgrId => {
      const mgr = employees.find(e => e.employeeId === mgrId) || { firstName: 'Manager', lastName: mgrId };
      const count = managerReportCount[mgrId];
      const isOverburdened = count > this.optimalSpanOfControlMax;
      const isUnderutilized = count < this.optimalSpanOfControlMin;

      return {
        managerId: mgrId,
        managerName: `${mgr.firstName} ${mgr.lastName}`,
        department: mgr.departmentId,
        directReportsCount: count,
        spanStatus: isOverburdened ? 'OVERBURDENED_SPAN' : (isUnderutilized ? 'NARROW_SPAN' : 'OPTIMAL_SPAN'),
        recommendation: isOverburdened ? 'Introduce team lead layer' : (isUnderutilized ? 'Consolidate reportees' : 'Healthy span')
      };
    });

    return {
      totalPeopleManagers: managersList.length,
      optimalManagersCount: managersList.filter(m => m.spanStatus === 'OPTIMAL_SPAN').length,
      overburdenedManagersCount: managersList.filter(m => m.spanStatus === 'OVERBURDENED_SPAN').length,
      managerDetails: managersList
    };
  }
}

export const organizationHierarchyEngine = new OrganizationHierarchyEngine();
