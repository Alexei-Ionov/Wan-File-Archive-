const universityData = [
  {
    university: 'UC Berkeley',
    departments: [
      {
        departmentName: 'CS',
        classes: ['162', '186', '61A', '61B', '61C'].map(classNumber => ({ classNumber }))
      },
      {
        departmentName: 'DATA',
        classes: ['8', '100'].map(classNumber => ({ classNumber }))
      },
      {
        departmentName: 'ME',
        classes: ['40', '108'].map(classNumber => ({ classNumber }))
      },
      {
        departmentName: 'E',
        classes: ['7'].map(classNumber => ({ classNumber }))
      }
    ]
  }
  // More universities...
];

module.exports = universityData;