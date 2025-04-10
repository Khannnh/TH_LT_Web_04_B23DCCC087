import { Effect, Reducer } from 'umi';

export interface ClubMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  strengths: string;
  registrationReason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  clubId: string;
  statusHistory?: Array<{
    status: 'pending' | 'approved' | 'rejected';
    timestamp: string;
    reason?: string;
    adminName: string;
  }>;
}

export interface Club {
  id: string;
  name: string;
  foundationDate: string;
  description: string;
  president: string;
  active: boolean;
  avatar?: string;
}

export interface ClubModelState {
  clubs: Club[];
  registrations: ClubMember[];
  members: ClubMember[];
  currentClub?: Club;
  loading: boolean;
  statistics?: {
    totalClubs: number;
    activeClubs: number;
    totalRegistrations: number;
    pendingRegistrations: number;
    approvedRegistrations: number;
    rejectedRegistrations: number;
    clubStats: Array<{
      id: string;
      name: string;
      totalMembers: number;
      pendingRegistrations: number;
      approvedRegistrations: number;
      rejectedRegistrations: number;
    }>;
  };
  chartData?: Array<{
    club: string;
    status: string;
    count: number;
  }>;
}

export interface ClubModelType {
  namespace: 'club';
  state: ClubModelState;
  effects: {
    fetchClubs: Effect;
    addClub: Effect;
    updateClub: Effect;
    removeClub: Effect;
    fetchRegistrations: Effect;
    addRegistration: Effect;
    updateRegistration: Effect;
    removeRegistration: Effect;
    approveRegistration: Effect;
    rejectRegistration: Effect;
    bulkApproveRegistrations: Effect;
    bulkRejectRegistrations: Effect;
    fetchMembers: Effect;
    changeClubForMembers: Effect;
    getStatistics: Effect;
    getRegistrationsByClub: Effect;
    exportMembersToExcel: Effect;
  };
  reducers: {
    saveClubs: Reducer<ClubModelState>;
    saveRegistrations: Reducer<ClubModelState>;
    saveMembers: Reducer<ClubModelState>;
    setCurrentClub: Reducer<ClubModelState>;
    setLoading: Reducer<ClubModelState>;
    saveStatistics: Reducer<ClubModelState>;
    saveChartData: Reducer<ClubModelState>;
  };
}

const ClubModel: ClubModelType = {
  namespace: 'club',
  state: {
    clubs: [],
    registrations: [],
    members: [],
    loading: false,
  },
  effects: {
    *fetchClubs({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const response = yield call(() => {
        return Promise.resolve(localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : []);
      });
      yield put({ type: 'saveClubs', payload: response });
      yield put({ type: 'setLoading', payload: false });
    },
    *addClub({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const newClub = { ...payload, id: Date.now().toString() };
      clubs.push(newClub);
      localStorage.setItem('clubs', JSON.stringify(clubs));
      yield put({ type: 'saveClubs', payload: clubs });
      yield put({ type: 'setLoading', payload: false });
    },
    *updateClub({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const index = clubs.findIndex((club: Club) => club.id === payload.id);
      if (index !== -1) {
        clubs[index] = payload;
        localStorage.setItem('clubs', JSON.stringify(clubs));
      }
      yield put({ type: 'saveClubs', payload: clubs });
      yield put({ type: 'setLoading', payload: false });
    },
    *removeClub({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const filteredClubs = clubs.filter((club: Club) => club.id !== payload);
      localStorage.setItem('clubs', JSON.stringify(filteredClubs));
      yield put({ type: 'saveClubs', payload: filteredClubs });
      yield put({ type: 'setLoading', payload: false });
    },
    *fetchRegistrations({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const response = yield call(() => {
        return Promise.resolve(localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : []);
      });
      yield put({ type: 'saveRegistrations', payload: response });
      yield put({ type: 'setLoading', payload: false });
    },
    *addRegistration({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const newRegistration = { 
        ...payload, 
        id: Date.now().toString(), 
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          timestamp: new Date().toISOString(),
          adminName: 'System'
        }]
      };
      registrations.push(newRegistration);
      localStorage.setItem('registrations', JSON.stringify(registrations));
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *updateRegistration({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const index = registrations.findIndex((reg: ClubMember) => reg.id === payload.id);
      if (index !== -1) {
        registrations[index] = payload;
        localStorage.setItem('registrations', JSON.stringify(registrations));
      }
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *removeRegistration({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const filteredRegistrations = registrations.filter((reg: ClubMember) => reg.id !== payload);
      localStorage.setItem('registrations', JSON.stringify(filteredRegistrations));
      yield put({ type: 'saveRegistrations', payload: filteredRegistrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *approveRegistration({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const index = registrations.findIndex((reg: ClubMember) => reg.id === payload.id);
      if (index !== -1) {
        registrations[index].status = 'approved';
        if (!registrations[index].statusHistory) {
          registrations[index].statusHistory = [];
        }
        registrations[index].statusHistory.push({
          status: 'approved',
          timestamp: new Date().toISOString(),
          adminName: payload.adminName || 'Admin'
        });
        localStorage.setItem('registrations', JSON.stringify(registrations));
      }
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *rejectRegistration({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const index = registrations.findIndex((reg: ClubMember) => reg.id === payload.id);
      if (index !== -1) {
        registrations[index].status = 'rejected';
        registrations[index].rejectReason = payload.reason;
        if (!registrations[index].statusHistory) {
          registrations[index].statusHistory = [];
        }
        registrations[index].statusHistory.push({
          status: 'rejected',
          timestamp: new Date().toISOString(),
          reason: payload.reason,
          adminName: payload.adminName || 'Admin'
        });
        localStorage.setItem('registrations', JSON.stringify(registrations));
      }
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *bulkApproveRegistrations({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      payload.ids.forEach((id: string) => {
        const index = registrations.findIndex((reg: ClubMember) => reg.id === id);
        if (index !== -1) {
          registrations[index].status = 'approved';
          if (!registrations[index].statusHistory) {
            registrations[index].statusHistory = [];
          }
          registrations[index].statusHistory.push({
            status: 'approved',
            timestamp: new Date().toISOString(),
            adminName: payload.adminName || 'Admin'
          });
        }
      });
      localStorage.setItem('registrations', JSON.stringify(registrations));
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *bulkRejectRegistrations({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      payload.ids.forEach((id: string) => {
        const index = registrations.findIndex((reg: ClubMember) => reg.id === id);
        if (index !== -1) {
          registrations[index].status = 'rejected';
          registrations[index].rejectReason = payload.reason;
          if (!registrations[index].statusHistory) {
            registrations[index].statusHistory = [];
          }
          registrations[index].statusHistory.push({
            status: 'rejected',
            timestamp: new Date().toISOString(),
            reason: payload.reason,
            adminName: payload.adminName || 'Admin'
          });
        }
      });
      localStorage.setItem('registrations', JSON.stringify(registrations));
      yield put({ type: 'saveRegistrations', payload: registrations });
      yield put({ type: 'setLoading', payload: false });
    },
    *fetchMembers({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      const members = registrations.filter((reg: ClubMember) => reg.status === 'approved');
      
      if (payload && payload.clubId) {
        const clubMembers = members.filter((member: ClubMember) => member.clubId === payload.clubId);
        yield put({ type: 'saveMembers', payload: clubMembers });
      } else {
        yield put({ type: 'saveMembers', payload: members });
      }
      
      yield put({ type: 'setLoading', payload: false });
    },
    *changeClubForMembers({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // In a real app, this would be an API call
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      
      payload.memberIds.forEach((id: string) => {
        const index = registrations.findIndex((reg: ClubMember) => reg.id === id);
        if (index !== -1) {
          registrations[index].clubId = payload.newClubId;
          if (!registrations[index].statusHistory) {
            registrations[index].statusHistory = [];
          }
          registrations[index].statusHistory.push({
            status: 'approved',
            timestamp: new Date().toISOString(),
            adminName: payload.adminName || 'Admin',
            reason: `Transferred to club ID: ${payload.newClubId}`
          });
        }
      });
      
      localStorage.setItem('registrations', JSON.stringify(registrations));
      yield put({ type: 'saveRegistrations', payload: registrations });
      
      // Update members list if we're viewing a specific club
      if (payload.currentClubId) {
        const members = registrations.filter(
          (reg: ClubMember) => reg.status === 'approved' && reg.clubId === payload.currentClubId
        );
        yield put({ type: 'saveMembers', payload: members });
      }
      
      yield put({ type: 'setLoading', payload: false });
    },
    *getStatistics({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      
      const totalClubs = clubs.length;
      const activeClubs = clubs.filter((club: Club) => club.active).length;
      
      const totalRegistrations = registrations.length;
      const pendingRegistrations = registrations.filter((reg: ClubMember) => reg.status === 'pending').length;
      const approvedRegistrations = registrations.filter((reg: ClubMember) => reg.status === 'approved').length;
      const rejectedRegistrations = registrations.filter((reg: ClubMember) => reg.status === 'rejected').length;
      
      const clubStats = clubs.map((club: Club) => {
        const clubRegistrations = registrations.filter((reg: ClubMember) => reg.clubId === club.id);
        return {
          id: club.id,
          name: club.name,
          totalMembers: clubRegistrations.filter((reg: ClubMember) => reg.status === 'approved').length,
          pendingRegistrations: clubRegistrations.filter((reg: ClubMember) => reg.status === 'pending').length,
          approvedRegistrations: clubRegistrations.filter((reg: ClubMember) => reg.status === 'approved').length,
          rejectedRegistrations: clubRegistrations.filter((reg: ClubMember) => reg.status === 'rejected').length,
        };
      });
      
      const statistics = {
        totalClubs,
        activeClubs,
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        rejectedRegistrations,
        clubStats,
      };
      
      yield put({ type: 'saveStatistics', payload: statistics });
      yield put({ type: 'setLoading', payload: false });
      
      return statistics;
    },
    *getRegistrationsByClub({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      
      const chartData: any[] = [];
      
      clubs.forEach((club: Club) => {
        const clubRegistrations = registrations.filter((reg: ClubMember) => reg.clubId === club.id);
        const pending = clubRegistrations.filter((reg: ClubMember) => reg.status === 'pending').length;
        const approved = clubRegistrations.filter((reg: ClubMember) => reg.status === 'approved').length;
        const rejected = clubRegistrations.filter((reg: ClubMember) => reg.status === 'rejected').length;
        
        if (pending > 0) {
          chartData.push({
            club: club.name,
            status: 'Pending',
            count: pending,
          });
        }
        
        if (approved > 0) {
          chartData.push({
            club: club.name,
            status: 'Approved',
            count: approved,
          });
        }
        
        if (rejected > 0) {
          chartData.push({
            club: club.name,
            status: 'Rejected',
            count: rejected,
          });
        }
      });
      
      yield put({ type: 'saveChartData', payload: chartData });
      yield put({ type: 'setLoading', payload: false });
      
      return chartData;
    },
    *exportMembersToExcel({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      const clubs = localStorage.getItem('clubs') ? JSON.parse(localStorage.getItem('clubs')!) : [];
      const registrations = localStorage.getItem('registrations') ? JSON.parse(localStorage.getItem('registrations')!) : [];
      
      // Filter members by club if clubId is provided
      const members = payload && payload.clubId
        ? registrations.filter((reg: ClubMember) => reg.status === 'approved' && reg.clubId === payload.clubId)
        : registrations.filter((reg: ClubMember) => reg.status === 'approved');
      
      // Prepare data for export
      const exportData = members.map((member: ClubMember) => {
        const club = clubs.find((c: Club) => c.id === member.clubId);
        return {
          'Name': member.name,
          'Email': member.email,
          'Phone': member.phone,
          'Gender': member.gender,
          'Address': member.address,
          'Strengths': member.strengths,
          'Club': club ? club.name : 'Unknown',
          'Registration Reason': member.registrationReason,
        };
      });
      
      yield put({ type: 'setLoading', payload: false });
      
      return exportData;
    },
  },
};

export default ClubModel;