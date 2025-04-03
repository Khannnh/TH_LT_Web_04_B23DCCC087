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
		path: '/diploma', //routes cha
		name: 'Quản lý văn bằng',//tên hiển thị ở giao diện
		icon: 'BookOutlined',
		routes: [
		  {
			path: '/diploma/books',
			name: 'Sổ văn bằng',//tên hiển thị ở giao diện
			component: './DiplomaManagement/Books', 
			//component trong page có folder DiplomaManagement
		  },
		  {
			path: '/diploma/decisions',
			name: 'Quyết định tốt nghiệp',//tên hiển thị ở giao diện
			component: './DiplomaManagement/Decisions',
			//component trong page có folder DiplomaManagement
		  },
		  {
			path: '/diploma/templates',
			name: 'Cấu hình biểu mẫu phụ lục văn bằng',//tên hiển thị ở giao diện
			component: './DiplomaManagement/Templates',
			//component trong page có folder DiplomaManagement
		  },
		  {
			path: '/diploma/list',
			name: 'Danh sách văn bằng',//tên hiển thị ở giao diện
			component: './DiplomaManagement/Diplomas',
			//component trong page có folder DiplomaManagement
		  },
		  {
			path: '/diploma/search',  //diploma là nhánh cha rồi chia ra các nhánh con
			name: 'Tra cứu văn bằng', //tên hiển thị ở giao diện
			component: './DiplomaManagement/Search',
			//component trong page có folder DiplomaManagement
		  },
		],
	},
	{
		path: '/order', //routes cha
		name: 'Quản lý đơn hàng',//tên hiển thị ở giao diện
		icon: 'ShoppingCartOutlined',
		routes: [
		  {
			path: '/order/list',
			name: 'Danh sách đơn hàng',//tên hiển thị ở giao diện
			component: './OrderManagement/Order',
			//component trong page có folder DiplomaManagement
		  },
		  {
			path: '/order/act',  //diploma là nhánh cha rồi chia ra các nhánh con
			name: 'Thao tác với đơn', //tên hiển thị ở giao diện
			component: './OrderManagement/OrderAct',
			//component trong page có folder DiplomaManagement
		  },
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
