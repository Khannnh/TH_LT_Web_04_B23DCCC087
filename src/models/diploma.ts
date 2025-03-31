export interface DiplomaBook {    //sổ văn bằng
    id: string;     //ko cần id vì mỗi một năm chỉ có 1 sổ văn bằng
    year: number;
    name: string;
    currentSequence: number; /*// Số thứ tự hiện tại 
                            dùng để cấp số vào sổ cho văn bằng*/
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GraduationDecision {   // quyết định tốt nghiệp
    id: string;
    decisionNumber: string; // số thứ tự của quyết định trong một năm cụ thể
    issueDate: string; // Ngày ban hành quyết định
    summary: string; //trích yếu của quyết định
    bookId: string;// Thuộc sổ văn bằng nào (liên kết với DiplomaBook)
    searchCount: number; //sổ lượt tra cứu quyết định tốt nghiệp
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FormField { //Cấu Hình Biểu Mẫu Phụ Lục Văn Bằng
    id: string;
    name: string; //tên trường thông tin
    displayName: string; //tên trường thông tin hiển thị cho người 
    dataType: 'string' | 'number' | 'date'; //kiểu union type
    isRequired: boolean; // Trường này có bắt buộc nhập không?
    orderIndex: number; // Vị trí hiển thị trên giao diện
  }
  
  export interface Diploma {
    id: string;// Mã văn bằng duy nhất
    bookId: string;// Thuộc sổ văn bằng nào
    decisionId: string;// Thuộc quyết định tốt nghiệp nào
    sequenceNumber: number;//số vào sổ
    diplomaNumber: string;// Số hiệu văn bằng
    studentId: string;
    fullName: string;
    birthDate: string;
    fieldValues: Record<string, string | number | Date>;

    //key được lưu trữ dạng string 
    //value có thể là 1 trong 3 kiểu dữ liệu
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SearchCriteria {
    diplomaNumber?: string;//số hiệu văn bằng
    sequenceNumber?: string;//số vào sổ 
    studentId?: string;
    fullName?: string;
    birthDate?: string;
    //Dấu ? trong TypeScript được sử dụng để đánh dấu một trường là tùy chọn.
  }