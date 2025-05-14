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
	path: '/adminquanly',
	name: 'Trang quản trị',
	icon: 'SettingOutlined',
	routes: [
		{
		path: '/adminquanly/diemden',
		name: 'Quản lý điểm đến',
		component: '@/pages/Destination/DiemDen/page/Trangquantri',
		},
		{
		path: '/adminquanly/thongke',
		name: 'Thống kê',
		component: '@/pages/Destination/ThongKe/thongke',
		},
	],
	},
  {
	path: '/quanlyđiaiem',
	name: 'khám phá du lịch',
	icon: 'SettingOutlined',
	routes: [
	{
		path: '/quanlyđiaiem/diadiem',
		name: 'Trang chủ_Khám phá điểm đến',
		component: '@/pages/Destination/DiemDen/page/KhamPhaDiemDen',
	  },
    {
    path: '/quanlyđiaiem/diadiem/taolich',
		name: 'Tạo lịch trình du lịch',
		component: '@/pages/Destination/DiemDen/page/itinerary/ItineraryEditor.tsx',
    }
  ],
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
