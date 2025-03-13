import menu from './vi-VN/menu';
import pages from './vi-VN/pages';

export default {
	'app.copyright.produced': 'RIPT',
	...menu,
	...pages,
	'menu.guessing-game': 'Trò Chơi Đoán Số',
	
  'menu.rockpaperscissors': 'Oẳn Tù Tì',
  'menu.rockpaperscissors.game': 'Chơi game',
  'menu.rockpaperscissors.history': 'Lịch sử',
  
  'menu.study': 'Quản lý học tập',
  'menu.study.subjects': 'Môn học',
  'menu.study.progress': 'Tiến độ',
  'menu.study.goals': 'Mục tiêu',

  'menu.questionbank': 'Ngân hàng câu hỏi',
  'menu.questionbank.subjects': 'Quản lý môn học',
  'menu.questionbank.questions': 'Quản lý câu hỏi',
  'menu.questionbank.exams': 'Quản lý đề thi',
  'menu.questionbank.examhistory': 'Lịch sử đề thi',

  'appointmentSystem.employees': 'Quản lý nhân viên',
  'appointmentSystem.services': 'Quản lý dịch vụ',
  'appointmentSystem.appointments': 'Quản lý lịch hẹn',
  'appointmentSystem.reviews': 'Đánh giá',
  'appointmentSystem.statistics': 'Thống kê',
  
  // Employee
  'appointmentSystem.employee.add': 'Thêm nhân viên',
  'appointmentSystem.employee.edit': 'Cập nhật nhân viên',
  'appointmentSystem.employee.delete': 'Xóa nhân viên',
  'appointmentSystem.employee.name': 'Họ và tên',
  'appointmentSystem.employee.phone': 'Số điện thoại',
  'appointmentSystem.employee.email': 'Email',
  'appointmentSystem.employee.services': 'Dịch vụ đảm nhận',
  'appointmentSystem.employee.maxCustomers': 'Số khách tối đa/ngày',
  'appointmentSystem.employee.workingHours': 'Lịch làm việc',
  'appointmentSystem.employee.status': 'Trạng thái',
  'appointmentSystem.employee.active': 'Hoạt động',
  'appointmentSystem.employee.inactive': 'Ngừng hoạt động',

  // Service
  'appointmentSystem.service.add': 'Thêm dịch vụ',
  'appointmentSystem.service.edit': 'Cập nhật dịch vụ',
  'appointmentSystem.service.delete': 'Xóa dịch vụ',
  'appointmentSystem.service.name': 'Tên dịch vụ',
  'appointmentSystem.service.description': 'Mô tả',
  'appointmentSystem.service.price': 'Giá',
  'appointmentSystem.service.duration': 'Thời gian thực hiện',
  'appointmentSystem.service.category': 'Danh mục',
  'appointmentSystem.service.image': 'Hình ảnh',
  'appointmentSystem.service.status': 'Trạng thái',
  'appointmentSystem.service.active': 'Đang cung cấp',
  'appointmentSystem.service.inactive': 'Ngừng cung cấp',

  // Appointment
  'appointmentSystem.appointment.add': 'Thêm lịch hẹn',
  'appointmentSystem.appointment.edit': 'Cập nhật lịch hẹn',
  'appointmentSystem.appointment.delete': 'Xóa lịch hẹn',
  'appointmentSystem.appointment.customerName': 'Tên khách hàng',
  'appointmentSystem.appointment.customerPhone': 'Số điện thoại',
  'appointmentSystem.appointment.service': 'Dịch vụ',
  'appointmentSystem.appointment.employee': 'Nhân viên',
  'appointmentSystem.appointment.date': 'Ngày',
  'appointmentSystem.appointment.time': 'Giờ',
  'appointmentSystem.appointment.status': 'Trạng thái',
  'appointmentSystem.appointment.notes': 'Ghi chú',

  // Review
  'appointmentSystem.review.rating': 'Đánh giá',
  'appointmentSystem.review.comment': 'Nhận xét',
  'appointmentSystem.review.reply': 'Phản hồi',
  'appointmentSystem.review.date': 'Thời gian',

  // Statistics
  'appointmentSystem.statistics.dateRange': 'Khoảng thời gian',
  'appointmentSystem.statistics.totalAppointments': 'Tổng số lịch hẹn',
  'appointmentSystem.statistics.totalRevenue': 'Doanh thu',
  'appointmentSystem.statistics.averageRating': 'Đánh giá trung bình',
  'appointmentSystem.statistics.completionRate': 'Tỷ lệ hoàn thành',
  'appointmentSystem.statistics.revenueByDay': 'Doanh thu theo ngày',
  'appointmentSystem.statistics.revenueByService': 'Doanh thu theo dịch vụ',
  'appointmentSystem.statistics.appointmentsByEmployee': 'Số lịch hẹn theo nhân viên',
};
