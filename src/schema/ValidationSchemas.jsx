import * as Yup from 'yup';
export const mergeTicketSchema = Yup.object().shape({
  contact: Yup.string().required('Contact is required'),
  ticket: Yup.string().required('Ticket is required'),
});

export const changePasswordSchema = Yup.object({
  // oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required('New Password is required')
    .min(6, 'New Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const loginSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  // password: Yup.string().required("Password is required"),
  // .matches(
  //   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one uppercase letter, one number, and one special character"
  // ),
});

// Settings

export const companyValidationSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  companyPrefix: Yup.string().required('Company prefix is required'),
});
export const departmentValidationSchema = Yup.object({
  departmentName: Yup.string().required('Department name is required'),
});

export const teamValidationSchema = Yup.object({
  teamName: Yup.string().required('Team name is required'),
  // supervisorName: Yup.array().min(1, "At least one supervisor is required"),
  departmentId: Yup.string().required('Department name is required'),
  divisionId: Yup.string().required('Division name is required'),
  idleStartHours: Yup.number().integer().required('Idle start Hour is required'),
  idleStartMinutes: Yup.number().integer().required('Idle start Minute is required'),
  idleEndHours: Yup.number().integer().required('Idle end Hour is required'),
  idleEndMinutes: Yup.number().integer().required('Idle end Minute is required'),
  first_response_duration: Yup.number().integer().required('First response duration is required'),
});
export const categoryValidationSchema = Yup.object({
  companyId: Yup.number().integer().required('Company ID is required'),
  // teamId: Yup.number().integer().required("Team ID is required"),
  categoryInEnglish: Yup.string().required('Category english name is required'),
  categoryInBangla: Yup.string().required('Company bangla name is required'),
});

// export const categoryValidationSchema = yup.object().shape({
//   companyIds: yup
//     .array()
//     .of(yup.number().required('Business entity is required'))
//     .min(1, 'At least one business entity is required')
//     .required('Business entity is required'),
//   teamIds: yup
//     .array()
//     .of(yup.number().required('Team is required'))
//     .min(1, 'At least one team is required')
//     .required('Team is required'),
//   categoryInEnglish: yup
//     .string()
//     .required('Category in English is required')
//     .max(255, 'Category name must be less than 255 characters'),
//   categoryInBangla: yup
//     .string()
//     .max(255, 'Category name must be less than 255 characters'),
// });

export const subCategoryValidationSchema = Yup.object({
  companyId: Yup.number().integer().required('Company ID is required'),
  teamId: Yup.array()
    .of(Yup.number())
    .min(1, 'At least one team is required')
    .required('Team is required'),
  categoryInEnglishId: Yup.mixed().required('Category name is required'),
  categoryInBanglaId: Yup.string(),
  subCategoryInEnglish: Yup.string().required('Sub-category name is required'),
  subCategoryInBangla: Yup.string().required('Sub-category name is required'),
});

export const emailTemplateValidationSchema = Yup.object({
  name: Yup.string().required('Template name is required'),
  subject: Yup.string().required('Subject is required'),
  content: Yup.string().required('Email content is required'),
});

export const notificationValidationSchema = Yup.object().shape({
  notificationName: Yup.string().required('Notification name is required'),
  emailTemplate: Yup.number().required('Email template is required'),
});

export const createSlaValidationSchema = (slaType) => {
  return Yup.object({
    slaName: Yup.string().required('SLA Name is required'),
    businessEntity: Yup.object().required('Business entity is required'),
    slaType: Yup.object().required('SLA For is required'),

    slaForTeam: Yup.object().when('slaType', {
      is: (value) => value && value.label === 'Sub-Category',
      then: Yup.object().required('SLA For Team is required'),
      otherwise: Yup.object().notRequired(),
    }),

    slaForClient: Yup.object().when('slaType', {
      is: (value) => value && value.label === 'Client',
      then: Yup.object().required('SLA For Client is required'),
      otherwise: Yup.object().notRequired(),
    }),

    firstResponseTimeDay: Yup.number()
      .required('First Response Time (Day) is required')
      .min(0, 'Must be greater than or equal to 0')
      .max(30, 'Must be less than or equal to 30'), // Corrected max value from 23 to 30
    firstResponseTimeHrs: Yup.number()
      .required('First Response Time (Hrs) is required')
      .min(0, 'Must be greater than or equal to 0')
      .max(23, 'Must be less than or equal to 23'),
    firstResponseTimeMins: Yup.number()
      .required('First Response Time (Mins) is required')
      .min(0, 'Must be greater than or equal to 0')
      .max(59, 'Must be less than or equal to 59'),

    serviceTimeDay: Yup.number()
      .required('Service Time (Day) is required')
      .min(0, 'Must be greater than or equal to 0'),
    serviceTimeHrs: Yup.number()
      .required('Service Time (Hrs) is required')
      .min(0, 'Must be greater than or equal to 0')
      .max(23, 'Must be less than or equal to 23'),
    serviceTimeMins: Yup.number()
      .required('Service Time (Mins) is required')
      .min(0, 'Must be greater than or equal to 0')
      .max(59, 'Must be less than or equal to 59'),
  });
};

export const clientValidationSchema = Yup.object({
  userType: Yup.string().required('User Type is required'),
  businessEntity: Yup.string().required('Business Entity is required'),
  defaultClient: Yup.string().required('Default Client is required'),
  // client: Yup.array().min(1, "At least one Client is required"),
  fullName: Yup.string().required('Full Name is required'),
  // primaryEmail: Yup.string()
  //   .email("Invalid email format")
  //   .required("Primary Email is required"),
  // secondaryEmail: Yup.string().email("Invalid email format"),
  // primaryPhone: Yup.string()
  //   .matches(/^[0-9]+$/, "Primary Phone must contain only numbers")
  //   .length(11, "Primary Phone must be exactly 11 digits")
  //   .required("Primary Phone is required"),
  // secondaryPhone: Yup.string()
  //   .matches(/^[0-9]+$/, "Secondary Phone must contain only numbers")
  //   .length(11, "Secondary Phone must be exactly 11 digits"),
  defaultBusinessEntity: Yup.string().required('Default Business Entity is required'),
  role: Yup.string().required('Default role is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  lock: Yup.boolean(),
  status: Yup.boolean().required('Status is required'),
});

export const addMultipleBusinessEntityUnderClientValidationSchema = Yup.object({
  userType: Yup.string().required('User Type is required'),
  businessEntity: Yup.string().required('Business Entity is required'),
  defaultClient: Yup.string().required('Default Client is required'),
  // childClient: Yup.array()
  //   .min(1, "At least one Child Client is required")
  //   .of(Yup.string().required("Each Child Client must be valid"))
  //   .required("Child Client is required"),
});
export const agentValidationSchema = Yup.object({
  // userType: Yup.string().required("User Type is required"),
  teams: Yup.array().min(1, 'At least one team is required'),
  fullName: Yup.string().required('Full Name is required'),
  primaryEmail: Yup.string().email('Invalid email format').required('Primary Email is required'),
  secondaryEmail: Yup.string().email('Invalid email format'),
  primaryPhone: Yup.string()
    .matches(/^[0-9]+$/, 'Primary Phone must contain only numbers')
    .length(11, 'Primary Phone must be exactly 11 digits')
    .required('Primary Phone is required'),
  secondaryPhone: Yup.string()
    .matches(/^[0-9]+$/, 'Secondary Phone must contain only numbers')
    .length(11, 'Secondary Phone must be exactly 11 digits'),
  defaultBusinessEntity: Yup.string().required('Default Business Entity is required'),
  role: Yup.string().required('Default role is required'),
  userName: Yup.string().required('Username is required'),
  // password: Yup.string()
  //   .min(6, "Password must be at least 6 characters")
  //   .required("Password is required"),
  lock: Yup.boolean(),
  status: Yup.boolean().required('Status is required'),
});

export const createTicketValidationSchema = Yup.object({
  clientInfo: Yup.object({
    userType: Yup.string().required('User type is required'),
    businessEntity: Yup.string().required('Business entity is required'),
    client: Yup.string().required('Client is required'),
    // fullName: Yup.string().required("Full name is required"),
    // primaryEmail: Yup.string()
    //   .email("Invalid email format")
    //   .required("Primary email is required"),
    // secondaryEmail: Yup.string().email("Invalid email format"),
    // primaryPhone: Yup.string().required("Primary phone is required"),
    // secondaryPhone: Yup.string(),
    // defaultBusinessEntity: Yup.string().required(
    //   "Default business entity is required"
    // ),
    // role: Yup.string().required("Role is required"),
    // userName: Yup.string().required("User name is required"),
    // password: Yup.string().required("Password is required"),
  }),

  ticketInfo: Yup.object({
    // businessEntity: Yup.string().required("Business entity is required"),
    // client: Yup.string().required("Client is required"),
    // source: Yup.string().required("Source is required"),
    category: Yup.string().required('Category is required'),
    subCategory: Yup.string().required('Sub-category is required'),
    teamId: Yup.string().required('The assigned team is required'),
  }),
});

export const commentValidationSchema = Yup.object({
  ticketNumber: Yup.string().required('Ticket Number name is required'),
  userId: Yup.string().required('Udser is required'),
  teamId: Yup.string().required('Team is required'),
  comment: Yup.string().required('Comment required*'),
});

export const assignValidationSchema = Yup.object({
  ticketNumber: Yup.string().required('Ticket Number name is required'),
  userId: Yup.string().required('Udser is required'),
  teamId: Yup.string().required('Team is required'),
  // statusId: Yup.string().required('Status is required'),
  comment: Yup.string().required('Comment required*'),
});

export const partnerComplainValidationSchema = Yup.object({
  businessEntity: Yup.string().required('Business entity name is required'),
  client: Yup.string().required('Client is required'),
  category: Yup.string().required('Category is required'),
  subCategory: Yup.string().required('SubCategory is required'),
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .matches(/^\d{11}$/, 'Mobile number must be exactly 11 digits'),
  // attachment: Yup.mixed().required("Attachment is required"),
  // descriptions: Yup.string().required("Description is required"),
});

export const elementValidationSchema = Yup.object({
  elementName: Yup.string().required('Element name is required'),
});
export const elementListValidationSchema = Yup.object({
  elementName: Yup.string().required('Element name is required'),
  elementList: Yup.string().required('Element list name is required'),
});

export const branchValidationSchema = Yup.object({
  businessEntity: Yup.string().required('Business entity name is required'),
  client: Yup.string().required('Client name is required'),
  branchName: Yup.string().required('Branch name is required'),
});

export const teamAdditionalConfigValidationSchema = Yup.object({
  teamIds: Yup.string().required('Team is required'),

  // ticketSlaHold: Yup.array()
  //   .min(1, 'At least one supervisor is required')
  //   .required('At least one supervisor is required'),

  // ticketReopen: Yup.array()
  //   .min(1, 'At least one supervisor is required')
  //   .required('At least one supervisor is required'),

  // ticketMerge: Yup.array()
  //   .min(1, 'At least one supervisor is required')
  //   .required('At least one supervisor is required'),

  // ticketEscalate: Yup.array()
  //   .min(1, 'At least one supervisor is required')
  //   .required('At least one supervisor is required'),
});
