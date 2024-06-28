const universityData = [
  {
    university: 'UC Berkeley',
    departments: [
      {
        departmentName: 'CS',
        classes: ['162', '186', '61A', '61B', '61C'].map(course_number => ({ course_number }))
      },
      {
        departmentName: 'DATA',
        classes: ['8', '100'].map(course_number => ({ course_number }))
      },
      {
        departmentName: 'ME',
        classes: ['40', '108'].map(course_number => ({ course_number }))
      },
      {
        departmentName: 'E',
        classes: ['7'].map(course_number => ({ course_number }))
      }
    ]
  }
  // More universities...
];

module.exports = universityData;