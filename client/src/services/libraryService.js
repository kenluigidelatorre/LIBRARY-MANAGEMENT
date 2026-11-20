const SETTINGS_STORAGE_KEY = 'cmd_lms_settings_v1';

export const DEFAULT_SETTINGS = {
  libraryName: 'CMD Library Management System',
  institutionCode: 'CMD-EDSC',
  contactEmail: 'library@cmd.edu',
  campusAddress: 'Academic Learning Commons, Building B',
  studentLoanDays: 14,
  facultyLoanDays: 30,
  maxBooksPerStudent: 4,
  maxBooksPerFaculty: 8,
  dailyFineRate: 1.0,
  reservationHoldDays: 7,
  emailNotifications: true,
  overdueAutoAlert: true,
};

export const libraryService = {
  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
    return settings;
  },

  resetSettings() {
    return this.saveSettings(DEFAULT_SETTINGS);
  },
};
