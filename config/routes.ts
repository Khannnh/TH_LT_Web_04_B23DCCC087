export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/study-management',
		name: 'study',
		icon: 'read',
		routes: [
			{
				path: '/study-management/subjects',
				name: 'subjects',
				component: '@/pages/StudyManagement/Subjects',
			},
			{
				path: '/study-management/progress',
				name: 'progress',
				component: '@/pages/StudyManagement/Progress',
			},
			{
				path: '/study-management/goals',
				name: 'goals',
				component: '@/pages/StudyManagement/Goals',
			},
		],
	},
	{
		path: '/trochoidoanso',
		name: 'Trò chơi đoán số',
		component: '@/pages/Game',
		icon: 'CalculatorOutlined',
	},
  {
		path: '/question-bank',
		name: 'questionbank',
		icon: 'BookOutlined',
		routes: [
			{
				path: '/question-bank/subjects',
				name: 'subjects',
				component: './QuestionBank/Subjects',
			},
			{
				path: '/question-bank/questions',
				name: 'questions',
				component: './QuestionBank/Questions',
			},
			{
				path: '/question-bank/exams',
				name: 'exams',
				component: './QuestionBank/Exams',
			},
		],
	},
	{
		path: '/rock-paper-scissors',
		name: 'rockpaperscissors',
		routes: [
			{
				path: '/rock-paper-scissors/game',
				name: 'game',
				component: './RockPaperScissors/Game',
			},
			{
				path: '/rock-paper-scissors/history',
				name: 'history',
				component: './RockPaperScissors/History',
			},
		],
	},
  {
    path: '/classroom',
    name: 'Quản lý phòng học',
    icon: 'TeamOutlined',
    component: '@/pages/Quản lí phòng học/ClassroomManagement',
    exact: true,
  },
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
